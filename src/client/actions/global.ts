import axios from 'axios';
import { AnyAction } from 'redux';

import { getStateType, ThunkAction, ThunkDispatch } from 'src/types/actions';

import { BreadcrumbItemType } from 'src/components/Breadcrumbs/types';
import { FileObject } from 'src/types/index';
import config from 'src/config';
import { TabNameType } from 'src/components/Tabs/types';
import * as TYPE from './types';


const AXIOS_INSTANCE = axios.create({
    baseURL: `http://localhost:${config.server.port}`
});

export function setActiveCrumb({ index, item }: { index?: number, item?: BreadcrumbItemType }) {
    return {
        type: TYPE.SET_ACTIVE_CRUMB,
        payload: { index, item }
    };
}

export function setActiveTab(tabName: TabNameType) {
    return {
        type: TYPE.SET_ACTIVE_TAB,
        payload: { tabName }
    };
}

export function searchFiles(searchName: string) {
    return {
        type: TYPE.SEARCH_FILES_BY_NAME,
        payload: {
            searchName
        }
    };
}

export function setCurrentRepository(item: string) {
    return {
        type: TYPE.SET_CURRENT_REPOSITORY,
        payload: { item }
    };
}

export function setNewBreadcrumbPath({ name, type }: BreadcrumbItemType) {
    const crumb = { name, type };
    return {
        type: TYPE.SET_NEW_BREADCRUMB_PATH,
        payload: { crumb }
    };
}

export function fetchFilesList({ url }: { url: string }): ThunkAction {
    return async function (dispatch: ThunkDispatch, getState: getStateType) {
        dispatch(fetchFilesListPending());

        if (url === '/') {
            const { currentRepo } = getState().global;
            url += currentRepo;
        }

        try {
            const { data: { files } } = await AXIOS_INSTANCE.get(config.api.apiBaseUrl + url);

            dispatch(fetchFilesListSuccess({ files }));
        } catch (e) {
            dispatch(fetchFilesListFail(e));
        }
    };
}

export function fetchFileContent({ url, name }: { url: string, name: string }): ThunkAction {
    return async function (dispatch) {
        dispatch(fetchFileContentPending());

        try {
            const { data } = await AXIOS_INSTANCE.get(config.api.apiBaseUrl + url, {
                transformResponse: res => res,
            });

            dispatch(fetchFileContentSuccess({ data, name }));
        } catch (e) {
            dispatch(fetchFileContentFail(e));
        }
    };
}

export function fetchFileContentPending(): AnyAction {
    return {
        type: TYPE.FETCH_FILE_CONTENT_PENDING
    };
}

export function fetchFilesListPending(): AnyAction {
    return {
        type: TYPE.FETCH_FILES_LIST_PENDING
    };
}

export function fetchFileContentSuccess({ data, name }: { data: string, name: string }): AnyAction {
    return {
        type: TYPE.FETCH_FILE_CONTENT_SUCCESS,
        payload: { data, name }
    };
}

export function fetchFilesListSuccess({ files }: { files: Array<FileObject> }): AnyAction {
    return {
        type: TYPE.FETCH_FILES_LIST_SUCCESS,
        payload: { files }
    };
}

export function fetchFileContentFail(e: Error): AnyAction {
    return {
        type: TYPE.FETCH_FILE_CONTENT_FAIL,
        payload: { error: e.message }
    };
}

export function fetchFilesListFail(e: Error): AnyAction {
    return {
        type: TYPE.FETCH_FILES_LIST_FAIL,
        payload: { error: e.message }
    };
}
