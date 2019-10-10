import path from 'path';
import { promises as fs } from 'fs';
import util from 'util';
import { exec } from 'child_process';

import config from 'src/config';
import APP_DATA from './appData';
import { TABS_TYPES } from '../client/constants';
import { getRepositoriesinFolder } from './helpers';
import { NoRepositoriesError } from './errors';

const promisifyExec = util.promisify(exec);

export function checkFolderPath(folderPath) {
    folderPath = path.normalize(folderPath);
    if (!path.isAbsolute(folderPath)) {
        throw new Error('Path to folder must be absolute!');
    }
    return folderPath;
}

export function serverInit({ folderPath, app }) {
    // Проверяем, существует ли папка.
    fs.stat(folderPath)
        .then(stats => {
            if (!stats.isDirectory()) {
                console.error('Provided path is not directory!', '\n');
                process.exit(1);
            }

            return getRepositoriesinFolder(folderPath);
        })
        .catch(() =>
        // Если папки нет - мы окажемся здесь и создадим ее.
            fs.mkdir(folderPath, { recursive: true })
        )
        .then(repositoriesInFolder => {
            // Есть ли в папке репозитории
            if (!repositoriesInFolder.length) {
                throw new NoRepositoriesError('There are no repositories in your folder!');
            }

            // Установлен ли гит
            return promisifyExec('which git');
        })
        .then(({ stdout }) => {
            if (!stdout) {
                console.error('Git is not installed!', '\n');
                process.exit(1);
            }

            APP_DATA.FOLDER_PATH = folderPath;

            const APP_PORT = process.env.APP_PORT
                ? parseInt(process.env.APP_PORT, 10)
                : config.server.port;

            // Успешный запуск
            app.listen(APP_PORT, () => {
                console.log(`Server listening on port ${APP_PORT}!`);
            });
        })
        .catch(error => {
            console.error('Folder cannot be created!');
            console.error(error.stack || error.message);
            process.exit(1);
        });
}


export const initPreloadedState = () => (
    {
        global: {
            waiting: false,
            error: null,
            searchName: '',
            currentRepo: '',
            currentBranch: '',
            repositories: [],
            breadCrumbsPath: [],
            activeTabName: TABS_TYPES.files,
            filesInRepoByPath: [],
            fileContent: {
                name: null,
                content: null
            }
        }
    }
);
