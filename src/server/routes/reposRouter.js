const express = require('express');
const rimraf = require('rimraf');

const { NoDirectoryError, NoAnyRemoteBranchesError } = require('../errors');
const utils = require('../utils');
const gitUtils = require('../gitUtils');
const { getRepositoriesinFolder, getRopositoryTree } = require('../helpers');

const router = express.Router();

// '/' === '/api/repos/'
// Возвращает массив репозиториев, которые имеются в папке.
router.get(
    '/',
    utils.wrapRoute(async (req, res) => {
        try {
            const statsArr = await getRepositoriesinFolder();
            res.json({ folders: statsArr });
        } catch (err) {
            console.error(err);
            res.status(501).json({
                error: 'An error occurred while trying to read the directory',
            });
        }
    })
);

// Добавляет репозиторий в список, скачивает его по переданной в теле запроса ссылке и добавляет в папку со всеми репозиториями.
router.post(
    '/:repositoryId',
    utils.wrapRoute(async (req, res) => {
        const { url } = req.body;
        const { repositoryId } = req.params;

        const targetDir = utils.getRepositoryPath(repositoryId);

        await gitUtils.clone(url, targetDir);
        res.json({ status: 'OK' });
    })
);

// Безвозвратно удаляет репозиторий
router.delete('/:repositoryId', (req, res) => {
    const { repositoryId } = req.params;

    const targetDir = utils.getRepositoryPath(repositoryId);

    rimraf(targetDir, error => {
        if (error) {
            res.status(501).json({
                error: error.message || 'An error occurred while trying to delete the directory',
            });
        } else {
            res.json({ status: 'OK' });
        }
    });
});

// Возвращает массив коммитов в данной ветке (или хэше коммита) вместе с датами их создания.
// router.get('/:repositoryId/commits/:commitHash', utils.wrapRoute(async (req, res) => {
//     const { repositoryId, commitHash } = req.params;
//     const targetDir = utils.getRepositoryPath(repositoryId);
//     await utils.checkDir(targetDir);
//     const commits = await gitUtils.getCommits(repositoryId, commitHash);
//     res.json({ commits });
// }));

// limit=10&offset=0
// Пагинация по массиву коммитов
router.get(
    '/:repositoryId/commits/:commitHash',
    utils.wrapRoute(async (req, res) => {
        const { repositoryId, commitHash } = req.params;
        let { limit = 10, offset = 0 } = req.query;

        offset = offset < 0 ? 0 : offset;

        const targetDir = utils.getRepositoryPath(repositoryId);

        await utils.checkDir(targetDir);

        const allCommitsNumber = await gitUtils.getNumberAllCommits(
            repositoryId,
            commitHash
        );

        const skip = offset * limit;
        if (skip >= allCommitsNumber) {
            // все просмотрели, больше не запрашиваем
            res.json({
                commits: [],
                total: allCommitsNumber,
                limit,
                offset,
            });
        }

        const commits = await gitUtils.getCommitAccordingPagination({
            repositoryId,
            commitHash,
            skip,
            maxCount: limit,
        });

        res.json({
            total: allCommitsNumber,
            limit,
            offset,
            commits,
        });
    })
);

// Возвращает diff коммита в виде строки.
router.get(
    '/:repositoryId/commits/:commitHash/diff',
    utils.wrapRoute(async (req, res) => {
        const { repositoryId, commitHash } = req.params;

        const targetDir = utils.getRepositoryPath(repositoryId);

        await utils.checkDir(targetDir);

        const parent = await gitUtils.getParentCommit(repositoryId, commitHash);

        gitUtils.diffStream({
            repositoryId,
            parent,
            commitHash,
            res,
        });
    })
);

// GET /api/repos/:repositoryId(/tree/:commitHash/:path)
// Возвращает содержимое репозитория по названию ветки (или хэшу комита).
// Параметр repositoryId - название репозитория (оно же - имя папки репозитория).
// Eсли отсутствует и branchName, и path - отдать актуальное содержимое в корне в главной ветке репозитория.
router.get(
    /^\/([^\/]+)(?:\/tree(?:\/([^\/]+)(\/.*)?)?)?$/,
    utils.wrapRoute(async (req, res) => {
        const { 0: repositoryId, 1: commitHash, 2: repoPath } = req.params;

        const files = await getRopositoryTree({ repositoryId, commitHash, repoPath });
        res.json({ files });
    })
);

// Возвращает содержимое конкретного файла, находящегося по пути pathToFile в ветке (или по хэшу коммита) branchName.
router.get(
    '/:repositoryId/blob/:commitHash/*',
    utils.wrapRoute(async (req, res) => {
        const { repositoryId, commitHash, 0: pathToFile } = req.params;

        const targetDir = utils.getRepositoryPath(repositoryId);

        await utils.checkDir(targetDir);

        await gitUtils.fetchOrigin(repositoryId);

        const remoteBranches = await gitUtils.getAllRemoteBranches(repositoryId);

        const isBranchName = remoteBranches.includes(commitHash);

        const command = isBranchName
            ? `origin/${commitHash}:`
            : `${commitHash}:`;

        gitUtils.showStream({
            repositoryId,
            command,
            pathToFile,
            res,
        });
    })
);

router.use((err, req, res, next) => {
    console.error(err);

    if (err instanceof NoDirectoryError) {
        res.status(400).json({
            error: 'The provided parameter is not directory name!',
        });
        return;
    }

    if (err instanceof NoAnyRemoteBranchesError) {
        res.status(400).json({
            error: 'There are no any branches in you repository yet!',
        });
        return;
    }

    res.status(501).json({ error: err.message || 'Server error' });
});

module.exports = router;
