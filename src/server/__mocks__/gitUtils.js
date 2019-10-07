const path = require('path');
const fs = require('fs').promises;

const getStat = async (name, path) => ({
    name,
    stat: await fs.stat(path)
});

module.exports = {
    // eslint-disable-next-line no-unused-vars
    async clone(url, targetDir) {
        return { stdout: '', stderr: '' };
    },
    async defineMainBranchName() {
        return 'master';
    },
    async getAllRemoteBranches() {
        return [ 'master' ];
    },
    async checkout() {
        return { stdout: '', stderr: '' };
    },
    async pull() {
        return { stdout: '', stderr: '' };
    },
    async getWorkingTree(repositoryId, commitHash, repopath = '') {
        const root = path.join('/', repositoryId, repopath);
        const content = await fs.readdir(root);
        const items = await Promise.all(content.map(
            name => getStat(name, path.join(root, name))
        ));
        return items.map(item => ({
            name: item.name,
            type: item.stat.isDirectory() ? 'tree' : 'blob',
            commitHash: 'ae56c1de',
            commitMessage: 'message',
            committerName: 'user',
            committerEmail: 'user@server.com',
            date: 1570305287710
        }));
    },
    async fetchOrigin(repositoryId) {
        return Promise.resolve();
    },
    async showStream({ repositoryId, command, res, pathToFile }) {
        pathToFile = path.join('/', repositoryId, pathToFile);
        const content = await fs.readFile(pathToFile);
        res.send(content);
    }
};
