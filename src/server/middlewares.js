import { cutPathFromFileName } from 'src/client/utils';
import {
    getRepositoriesinFolder,
    getMainBranchName,
    getRopositoryTree,
    restoreBreadCrumbsByPath,
    getFileContent
} from './helpers';

import { NoRepositoriesError } from './errors';

import * as serverUtils from './serverUtils';
import { TABS_TYPES, TABS_BY_BREADCRUMB_TYPE, FILES_TYPES } from '../client/constants';

export async function prepareState(req, res, next) {
    const preloadedState = serverUtils.initPreloadedState();
    try {
        req.state = await getData({ req, state: preloadedState });
        next();
    } catch (err) {
        next(err);
    }
}

async function getData({ req, state }) {
    const repositoriesInFolder = await getRepositoriesinFolder();

    if (!repositoriesInFolder.length) {
        throw new NoRepositoriesError('There are no repositories in your folder!');
    }

    const { url } = req;
    const urlPaths = url.match(/^\/([^\/]+)(?:\/(tree|blob)(?:\/([^\/]+)(\/.*)?)?)?$/);


    if (!urlPaths) {
        // запросили начальную страницу
        // eslint-disable-next-line prefer-destructuring
        const currentRepo = repositoriesInFolder[0];

        const filesInRepoByPath = await getRopositoryTree({ repositoryId: currentRepo });
        const currentBranch = await getMainBranchName(currentRepo);

        return {
            ...state,
            global: {
                ...state.global,
                currentRepo,
                currentBranch,
                repositories: repositoriesInFolder,
                breadCrumbsPath: [
                    {
                        name: currentRepo,
                        type: 'tree'
                    }
                ],
                activeTabName: TABS_TYPES.files,
                filesInRepoByPath
            }
        };
    }
    // в url есть параметры
    let [ , currentRepo, type, currentBranch, repoPath ] = urlPaths;


    if (!type || !currentBranch) {
        // отдать содержимое в корне репозитория
        type = FILES_TYPES.tree;
        currentBranch = await getMainBranchName(currentRepo);
    }

    // type - tree или blob надо собирать разные данные
    state = {
        ...state,
        global: {
            ...state.global,
            currentRepo,
            currentBranch,
            repositories: repositoriesInFolder,
            breadCrumbsPath: restoreBreadCrumbsByPath({ repoName: currentRepo, repoPath, typeOfLastCrumb: type }),
            activeTabName: TABS_BY_BREADCRUMB_TYPE[type][0]
        },
    };

    if (type === FILES_TYPES.tree) {
        state.global.filesInRepoByPath = await getRopositoryTree({
            repositoryId: currentRepo,
            commitHash: currentBranch,
            repoPath
        });
    }

    if (type === FILES_TYPES.blob) {
        const content = await getFileContent({
            repositoryId: currentRepo,
            commitHash: currentBranch,
            pathToFile: repoPath.slice(1)
        });

        state.global.fileContent = {
            name: cutPathFromFileName(repoPath),
            content: content.stdout
        };
    }

    return state;
}
