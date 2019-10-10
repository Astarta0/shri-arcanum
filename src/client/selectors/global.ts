import { AppStateType } from 'src/types/store';

export const getAll = (state: AppStateType) => state.global;
export const getCurrentRepo = (state: AppStateType) => getAll(state).currentRepo;
export const getCurrentBranch = (state: AppStateType) => getAll(state).currentBranch;
export const getBreadCrumbsPath = (state: AppStateType) => getAll(state).breadCrumbsPath;
export const getActiveTabName = (state: AppStateType) => getAll(state).activeTabName;
export const getRepositoriesList = (state: AppStateType) => getAll(state).repositories;

export const getLastActiveBreadcrumbItem = (state: AppStateType) => {
    const [ lastItem ] = getBreadCrumbsPath(state).slice(-1);
    return lastItem;
};

export const getFilesInRepo = (state: AppStateType) => getAll(state).filesInRepoByPath;
export const getWaitingFlag = (state: AppStateType) => getAll(state).waiting;
export const getError = (state: AppStateType) => getAll(state).error;
export const getSearchName = (state: AppStateType) => getAll(state).searchName;

export const filterFilesBySearchName = (state: AppStateType) => {
    const searchName = getSearchName(state).toLocaleLowerCase();
    return getAll(state).filesInRepoByPath.filter(({ name }) => {
        return name.toLocaleLowerCase().includes(searchName);
    });
};

export const getFileContent = (state: AppStateType) => getAll(state).fileContent.content;

export const getOpenedFileName = (state: AppStateType) => getAll(state).fileContent.name;
