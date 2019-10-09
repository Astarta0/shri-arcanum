import axios from 'axios';
import { Dispatch as DispatchType } from 'redux';

import { AppStateType } from 'src/types/store';
import { getStateType, ThunkAction, RawThunkAction, ThunkDispatch } from 'src/types/actions';


import config from 'src/config';
import * as TYPE from './types';

const AXIOS_INSTANCE = axios.create({
    baseURL: `http://localhost:${config.server.port}`
});

export function setActiveCrumb({ index, item }: { index?: number, item?: string }) {
    return {
        type: TYPE.SET_ACTIVE_CRUMB,
        payload: { index, item }
    };
}

export function setActiveTab(tabName) {
    return {
        type: TYPE.SET_ACTIVE_TAB,
        payload: { tabName }
    };
}

export function searchFiles(searchName) {
    return {
        type: TYPE.SEARCH_FILES_BY_NAME,
        payload: {
            searchName
        }
    };
}

export function setCurrentRepository(item) {
    return {
        type: TYPE.SET_CURRENT_REPOSITORY,
        payload: { item }
    };
}

export function setNewBreadcrumbPath({ name, type }) {
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

export function fetchFileContent({ url, name }) {
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

export function fetchFileContentPending() {
    return {
        type: TYPE.FETCH_FILE_CONTENT_PENDING
    };
}

export function fetchFilesListPending() {
    return {
        type: TYPE.FETCH_FILES_LIST_PENDING
    };
}

export function fetchFileContentSuccess({ data, name }) {
    return {
        type: TYPE.FETCH_FILE_CONTENT_SUCCESS,
        payload: { data, name }
    };
}

export function fetchFilesListSuccess({ files }) {
    return {
        type: TYPE.FETCH_FILES_LIST_SUCCESS,
        payload: { files }
    };
}

export function fetchFileContentFail(e) {
    return {
        type: TYPE.FETCH_FILE_CONTENT_FAIL,
        payload: { error: e.message }
    };
}

export function fetchFilesListFail(e) {
    return {
        type: TYPE.FETCH_FILES_LIST_FAIL,
        payload: { error: e.message }
    };
}
