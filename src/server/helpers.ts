import path from 'path';
import { promises as fs } from 'fs';
import junk from 'junk';

import { FILES_TYPES } from 'src/client/constants';
import * as utils from './utils';
import * as gitUtils from './gitUtils';
import APP_DATA from './appData';
import queue from './queue';

export const getRepositoriesinFolder = async (folderPath?: string) => {
    let files = await fs.readdir(folderPath || APP_DATA.FOLDER_PATH);
    files = files.filter(junk.not);

    let statsArr = await Promise.all(
        files.map(file => fs
            .stat(path.join(folderPath || APP_DATA.FOLDER_PATH, '/', file))
            .then(stat => ({
                file,
                stat,
            }))
            .catch(err => err))
    );

    statsArr = statsArr
        .filter(sObj => !(sObj instanceof Error))
        .filter(sObj => sObj.stat.isDirectory())
        .map(sObj => sObj.file);

    return statsArr;
};

export const getMainBranchName = async (repositoryId: string) => {
    const mainBranch = await gitUtils.defineMainBranchName(repositoryId);
    return mainBranch || '';
};

interface RestoreBreadCrumbsByPathOptions {
    repoName: string,
    repoPath: string,
    typeOfLastCrumb: 'tree'|'blob'
}
export const restoreBreadCrumbsByPath = (options: RestoreBreadCrumbsByPathOptions) => {
    const { repoName, repoPath, typeOfLastCrumb } = options;
    if (!repoPath) {
        // запрашиваем содержимое в корне репозитория
        return [ {
            name: repoName,
            type: FILES_TYPES.tree
        } ];
    }

    const paths = repoPath.split('/')
        .filter(p => p)
        .map((p, index, arr) => ({
            name: p,
            type: index === arr.length - 1 ? FILES_TYPES[typeOfLastCrumb] : FILES_TYPES.tree
        }));
    paths.unshift({
        name: repoName,
        type: FILES_TYPES.tree
    });
    return paths;
};

interface GetRopositoryTreeOptions {
    repositoryId: string,
    commitHash?: string,
    repoPath?: string
}
export const getRopositoryTree = async (options: GetRopositoryTreeOptions) => {
    const { repositoryId, commitHash, repoPath } = options;
    const targetDir = utils.getRepositoryPath(repositoryId);

    // Добавляем обработчик в очередь, так как тут делается checkout и pull,
    // чтобы избежать race condition, когда одновременно придет несколько
    // запросов на получение информации из разных веток одного репозитория,
    // или из другого репозитория
    // eslint-disable-next-line no-return-await
    return await queue.push(async () => {
        await utils.checkDir(targetDir);

        let mainBranch = commitHash;

        if (!mainBranch) {
            mainBranch = await gitUtils.defineMainBranchName(repositoryId);
        }

        await gitUtils.checkout(repositoryId, mainBranch);

        // если хеш коммита - нельзя выполнить pull, чтобы получить последнее актуальное состояние
        // получаем список веток и смотрим передали нам имя ветки или хеш коммита
        const remoteBranches = await gitUtils.getAllRemoteBranches(repositoryId);

        const isBranchName = remoteBranches.includes(mainBranch);

        if (isBranchName) {
            await gitUtils.pull(repositoryId);
        }

        return gitUtils.getWorkingTree(
            repositoryId,
            mainBranch,
            repoPath
                ? repoPath.endsWith('/')
                    ? repoPath.slice(1)
                    : repoPath.slice(1) + '/'
                : ''
        );
    });
};

interface GetFileContentOptions {
    repositoryId: string,
    commitHash: string,
    pathToFile: string
}
export const getFileContent = async (options: GetFileContentOptions) => {
    const { repositoryId, commitHash, pathToFile } = options;
    const targetDir = utils.getRepositoryPath(repositoryId);

    await utils.checkDir(targetDir);

    await gitUtils.fetchOrigin(repositoryId);

    const remoteBranches = await gitUtils.getAllRemoteBranches(repositoryId);

    const isBranchName = remoteBranches.includes(commitHash);

    const command = isBranchName
        ? `origin/${commitHash}:${pathToFile}`
        : `${commitHash}:${pathToFile}`;

    return gitUtils.showFileContent({
        repositoryId,
        command
    });
};
