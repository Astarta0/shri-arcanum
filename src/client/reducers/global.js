import * as TYPE from '../actions/types';

const INITIAL_STATE = {
    currentRepo: '',
    repositories: [],
    breadCrumbsPath: [],
    activeTabName: null,
    filesInRepoByPath: [],
    waiting: false,
    error: null,
    searchName: '',
    fileContent: {
        fileName: null,
        content: null
    }
};

export default function globalReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
    case TYPE.SET_ACTIVE_CRUMB: {
        const { index, item } = action.payload;
        const oldBreadcrumbs = state.breadCrumbsPath.slice();

        const breadCrumbsPath = item
            ? oldBreadcrumbs.concat(item)
            : oldBreadcrumbs.slice(0, index + 1);

        return {
            ...state,
            breadCrumbsPath
        };
    }

    case TYPE.SET_ACTIVE_TAB:
        return {
            ...state,
            activeTabName: action.payload.tabName
        };

    case TYPE.SET_CURRENT_REPOSITORY:
        return {
            ...state,
            currentRepo: action.payload.item
        };

    case TYPE.SEARCH_FILES_BY_NAME:
        return {
            ...state,
            searchName: action.payload.searchName
        };

    case TYPE.SET_NEW_BREADCRUMB_PATH:
        return {
            ...state,
            breadCrumbsPath: [ action.payload.crumb ]
        };

    case TYPE.FETCH_FILES_LIST_PENDING:
    case TYPE.FETCH_FILE_CONTENT_PENDING:
        return {
            ...state,
            waiting: true,
            error: null
        };

    case TYPE.FETCH_FILES_LIST_SUCCESS:
        return {
            ...state,
            filesInRepoByPath: action.payload.files,
            waiting: false,
            error: null
        };

    case TYPE.FETCH_FILE_CONTENT_SUCCESS:
        return {
            ...state,
            waiting: false,
            error: null,
            fileContent: {
                ...state.fileContent,
                name: action.payload.name,
                content: action.payload.data
            }
        };

    case TYPE.FETCH_FILES_LIST_FAIL:
        return {
            ...state,
            waiting: false,
            error: action.payload.error
        };

    default:
        return state;
    }
}
