import { PlainAction } from 'src/types/actions';
import { FileObject } from 'src/types';
import { TABS_TYPES } from 'src/client/constants';
import { BreadcrumbItemType } from 'src/components/Breadcrumbs/types';
import { TabNameType } from 'src/components/Tabs/types';
import * as TYPE from '../actions/types';

type GlobalState = {
    currentRepo: string,
    currentBranch: string,
    repositories: Array<string>,
    breadCrumbsPath: Array<BreadcrumbItemType>,
    activeTabName: TabNameType,
    filesInRepoByPath: Array<FileObject>,
    waiting: boolean,
    error: string | null,
    searchName: string,
    fileContent: {
        name: string | null,
        content: string | null
    }
};

const INITIAL_STATE: GlobalState = {
    currentRepo: '',
    currentBranch: '',
    repositories: [],
    breadCrumbsPath: [],
    activeTabName: TABS_TYPES.files,
    filesInRepoByPath: [],
    waiting: false,
    error: null,
    searchName: '',
    fileContent: {
        name: null,
        content: null
    }
};

export default function globalReducer(state = INITIAL_STATE, action: PlainAction): GlobalState {
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
