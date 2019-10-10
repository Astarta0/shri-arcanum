import path from 'path';
import { promises as fs } from 'fs';
import { ChildProcess } from 'child_process';
import { Request, Response, NextFunction } from 'express';
import { NoDirectoryError } from './errors';
import APP_DATA from './appData';

export function getRepositoryPath(id: string) {
    return path.join(APP_DATA.FOLDER_PATH, '/', id);
}

export function getGitDir(repositoryPath: string) {
    return path.join(APP_DATA.FOLDER_PATH, '/', repositoryPath, '/.git');
}

export const getGitDirParam = (repositoryId: string) => `--git-dir=${getGitDir(repositoryId)}`;

export const getWorkTreeParam = (repositoryId: string) => `--work-tree=${getRepositoryPath(repositoryId)}`;

export async function checkAndChangeDir(path: string) {
    const stats = await fs.stat(path);

    if (!stats.isDirectory()) {
        throw new NoDirectoryError();
    }

    process.chdir(path);
}

export async function checkDir(path: string) {
    const stats = await fs.stat(path);

    if (!stats.isDirectory()) {
        throw new NoDirectoryError();
    }
}
// ChildProcess
interface PipeOptions {
    from: ChildProcess,
    to: Response,
    onStderrData: (data: string) => void,
    onStdoutError: (err: Error) => void
}
export function pipe(options: PipeOptions) {
    const { from, to, onStderrData, onStdoutError } = options;
    if (!from.stderr || !from.stdout) return;
    from.stderr.on('data', onStderrData);
    from.stdout.pipe(to);
    from.stdout.on('error', onStdoutError);
    to.on('close', () => {
        if (!from.stderr || !from.stdout) return;
        from.stdout.destroy();
        from.stderr.destroy();
    });
}

export const wrapRoute = (fn: (res: Request, req: Response, next: NextFunction) => Promise<unknown>) =>
    (res: Request, req: Response, next: NextFunction) => fn(res, req, next).catch(next);
