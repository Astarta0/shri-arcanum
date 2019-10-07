export const getAll = state => state.global;
export const getCurrentRepo = state => getAll(state).currentRepo;
export const getCurrentBranch = state => getAll(state).currentBranch;
export const getBreadCrumbsPath = state => getAll(state).breadCrumbsPath;
export const getActiveTabName = state => getAll(state).activeTabName;
export const getRepositoriesList = state => getAll(state).repositories;

export const getLastActiveBreadcrumbItem = state => {
    const [ lastItem ] = getBreadCrumbsPath(state).slice(-1);
    return lastItem;
};

export const getFilesInRepo = state => getAll(state).filesInRepoByPath;
export const getWaitingFlag = state => getAll(state).waiting;
export const getError = state => getAll(state).error;
export const getSearchName = state => getAll(state).searchName;

export const filterFilesBySearchName = state => {
    const searchName = getSearchName(state).toLocaleLowerCase();
    return getAll(state).filesInRepoByPath.filter(({ name }) => {
        return name.toLocaleLowerCase().includes(searchName);
    });
};

export const getFileContent = state => {
    return getAll(state).fileContent.content;
};

export const getOpenedFileName = state => {
    return getAll(state).fileContent.name;
};
