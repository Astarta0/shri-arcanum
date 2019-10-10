import { Request } from 'express';

import { AppStateType } from 'src/types/store';

declare global {
    interface Window {
        __PRELOADED_STATE__: AppStateType;
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
