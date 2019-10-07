const path = require('path');
const fs = require('fs').promises;

const { NoDirectoryError } = require('./errors');
const APP_DATA = require('./appData');

let utils = {};
// eslint-disable-next-line no-multi-assign
module.exports = utils = {
    getRepositoryPath(id) {
        return path.join(APP_DATA.FOLDER_PATH, '/', id);
    },

    getGitDir(repositoryPath) {
        return path.join(APP_DATA.FOLDER_PATH, '/', repositoryPath, '/.git');
    },

    getGitDirParam: repositoryId => `--git-dir=${utils.getGitDir(repositoryId)}`,

    getWorkTreeParam: repositoryId => `--work-tree=${utils.getRepositoryPath(repositoryId)}`,

    async checkAndChangeDir(path) {
        const stats = await fs.stat(path);

        if (!stats.isDirectory()) {
            throw new NoDirectoryError();
        }

        process.chdir(path);
    },

    async checkDir(path) {
        const stats = await fs.stat(path);

        if (!stats.isDirectory()) {
            throw new NoDirectoryError();
        }
    },

    pipe({ from, to, onStderrData, onStdoutError }) {
        from.stderr.on('data', onStderrData);
        from.stdout.pipe(to);
        from.stdout.on('error', onStdoutError);
        to.on('close', () => {
            from.stdout.destroy();
            from.stderr.destroy();
        });
    },

    wrapRoute: fn => (...args) => fn(...args).catch(args[2]),

    logify: fn => {
        return (...args) => {
            console.log('>', ...args);
            return fn(...args);
        };
    }
};
