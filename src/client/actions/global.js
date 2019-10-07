import axios from 'axios';

import config from 'src/config';
import * as TYPE from './types';

const AXIOS_INSTANCE = axios.create({
    baseURL: `http://localhost:${config.server.port}`
});

export function setActiveCrumb({ index, item }) {
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

// GET /api/repos/:repositoryId(/tree/:commitHash/:path)
// http://localhost:3000/api/repos/differentBranchesRepository/blob/master/folderOnMaster/tests/test.js
// Возвращает содержимое репозитория по названию ветки (или хэшу комита).
export function fetchFilesList({ url }) {
    return async function (dispatch, getState) {
        dispatch({
            type: TYPE.FETCH_FILES_LIST_PENDING
        });

        if (url === '/') {
            const { currentRepo } = getState().global;
            url += currentRepo;
        }

        try {
            const { data: { files } } = await AXIOS_INSTANCE.get(config.api.apiBaseUrl + url);

            dispatch({
                type: TYPE.FETCH_FILES_LIST_SUCCESS,
                payload: { files }
            });
        } catch (e) {
            dispatch({
                type: TYPE.FETCH_FILES_LIST_FAIL,
                payload: { error: e.message }
            });
        }
    };
}

export function fetchFileContent({ url, name }) {
    return async function (dispatch) {
        dispatch({
            type: TYPE.FETCH_FILE_CONTENT_PENDING
        });

        try {
            const { data } = await AXIOS_INSTANCE.get(config.api.apiBaseUrl + url, {
                transformResponse: res => res,
            });

            dispatch({
                type: TYPE.FETCH_FILE_CONTENT_SUCCESS,
                payload: { data, name }
            });
        } catch (e) {
            dispatch({
                type: TYPE.FETCH_FILE_CONTENT_FAIL,
                payload: { error: e.message }
            });
        }
    };
}
