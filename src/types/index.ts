import { Request } from 'express';

import { AppStateType } from 'src/types/store';

declare global {
    interface Window {
        __PRELOADED_STATE__: AppStateType;
        __REDUX_DEVTOOLS_EXTENSION__: Function;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
    }
}

export type FileObject = {
    name: string,
    type: 'tree'| 'blob',
    commitHash: string,
    commitMessage: string,
    committerName: string,
    committerEmail: string,
    date: number
};

export interface IRequest extends Request{
    state?: AppStateType
}

export interface IContext {
    url?: string,
    status?: number
}
