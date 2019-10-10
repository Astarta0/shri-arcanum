import util from 'util';
import child from 'child_process';
import { Response } from 'express';
import { NoAnyRemoteBranchesError } from './errors';
import { getGitDirParam, getWorkTreeParam, pipe } from './utils';

const exec = util.promisify(child.exec);
const { spawn } = child;

export const clone = (url: string, targetDir: string) =>
    exec(`GIT_TERMINAL_PROMPT=0 git clone ${url} ${targetDir}`);

export const checkout = (repositoryId: string, commitHash: string) => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);
    return exec(`git ${gitDir} ${workTree} checkout --force ${commitHash}`);
};

export const pull = (repositoryId: string) => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);
    return exec(`git ${gitDir} ${workTree} pull`);
};

export const fetchOrigin = (repositoryId: string) => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);
    return exec(`git ${gitDir} ${workTree} fetch origin`);
};

export const getCommits = async (repositoryId: string, commitHash: string) => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    // дата в timestamp, преобразование будет на стороне клиента
    const { stdout } = await exec(
        `git ${gitDir} ${workTree} log ${commitHash} --pretty=format:'{%n%h%n%s%n%aN%n%cN%n%at%n}%n'`
    );

    const commits = stdout.match(/\{\n([\s\S]*?)\n\}/g);
    if (!commits) {
        return [];
    }

    return commits
        .map(commit =>
            commit.match(/\{\n(.*?)\n(.*?)\n(.*?)\n(.*?)\n(.*?)\n\}/)
        )
        .map((groups: RegExpMatchArray | null) => {
            if (!groups) return;
            const [ all, hash, subject, author, committer, date ] = groups;
            // eslint-disable-next-line consistent-return
            return {
                hash,
                subject,
                author,
                committer,
                date,
            };
        })
        .filter(Boolean);
};

interface GetCommitAccordingPaginationOptions {
    repositoryId: string,
    commitHash: string,
    skip: number,
    maxCount: number,
}

export const getCommitAccordingPagination = async (options: GetCommitAccordingPaginationOptions) => {
    const {
        repositoryId,
        commitHash,
        skip,
        maxCount,
    } = options;
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    const { stdout } = await exec(
        `git ${gitDir} ${workTree} rev-list ${commitHash} --skip=${skip} --max-count=${maxCount} --pretty=format:'{%n%h%n%s%n%aN%n%cN%n%at%n}%n'`
    );
    const commits = stdout.match(/\{\n([\s\S]*?)\n\}/g);
    if (!commits) {
        return [];
    }

    return commits
        .map((commit: string) =>
            commit.match(/\{\n(.*?)\n(.*?)\n(.*?)\n(.*?)\n(.*?)\n\}/)
        )
        .map((groups: RegExpMatchArray | null) => {
            if (!groups) return;
            const [ all, hash, subject, author, committer, date ] = groups;
            // eslint-disable-next-line consistent-return
            return {
                hash,
                subject,
                author,
                committer,
                date,
            };
        })
        .filter(Boolean);
};

export const getNumberAllCommits = async (repositoryId: string, commitHash: string) => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);
    const { stdout: total } = await exec(
        `git ${gitDir} ${workTree} rev-list ${commitHash} --count`
    );
    return Number(total.trim());
};

export const getParentCommit = async (repositoryId: string, commitHash: string) => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    const { stdout: commitParent } = await exec(
        `git ${gitDir} ${workTree} show ${commitHash} --pretty=format:'{%p}' --quiet`
    );

    // Проверяем есть ли у коммита родительский коммит
    return /\{.+\}/i.test(commitParent)
        // если есть, то просто используем синтаксис для взятия родителя
        // относительно которого построим дифф
        ? `${commitHash}~`
        // если нет, то значит это первый коммит в репозитории
        // и для того чтобы взять дифф в качестве parent коммита
        // мы укажем hash пустого дерева
        : '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
};

export const defineMainBranchName = async (repositoryId: string) => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    const { stdout: mainBranchName } = await exec(
        `git ${gitDir} ${workTree} symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'`
    );
    if (!mainBranchName) throw new NoAnyRemoteBranchesError();
    return mainBranchName.trim();
};

export const getAllRemoteBranches = async (repositoryId: string) => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    const { stdout: remoteBranches } = await exec(
        `git ${gitDir} ${workTree} branch --remotes --format='%(refname:lstrip=-1)' | grep -v '^HEAD$'`
    );
    return remoteBranches.split('\n');
};

export const getWorkingTree = async (repositoryId: string, commitHash: string, path: string = '') => {
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    console.log({ gitDir, workTree, commitHash, path });

    const { stdout: stdoutLstree } = await exec(
        `git ${gitDir} ${workTree} ls-tree ${commitHash} ${path}`
    );

    const files = stdoutLstree
        .split('\n')
        .filter(str => str)
        .map(str => {
            const [ , type, , name ] = str.split(/\s/g);
            return {
                type,
                name,
            };
        });

    const filesInfo = await Promise.all(files.map(({ name }) => exec(
        `git ${gitDir} ${workTree} log --pretty=format:'%h%n%s%n%cN%n%cE%n%at%n' -n 1 ${commitHash} -- ${name}`
    )));

    return filesInfo.map((obj, idx) => {
        const [ commitHash, commitMessage, committerName, committerEmail, date ] = obj.stdout.split(/\n/g);

        return {
            name: files[idx].name,
            type: files[idx].type,
            commitHash,
            commitMessage,
            committerName,
            committerEmail,
            date
        };
    });
};

interface DiffStreamOptions {
    repositoryId: string,
    parent: string,
    commitHash: string,
    res: Response
}

export const diffStream = (options: DiffStreamOptions) => {
    const { repositoryId, parent, commitHash, res } = options;
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    const gitProcess = spawn('git', [ gitDir, workTree, 'diff', parent, commitHash ]);

    gitProcess.stderr.setEncoding('utf8');
    gitProcess.stdout.setEncoding('utf8');

    pipe({
        from: gitProcess,
        to: res,
        onStderrData(data) {
            console.error(data);
            gitProcess.stdout.unpipe(res);
            res.status(404).json({ error: data });
        },
        onStdoutError(err) {
            res.statusCode = 500;
            res.end('Server Error');
            console.error(err);
        }
    });
};

interface ShowStreamOptions {
    repositoryId: string,
    command: string,
    res: Response,
    pathToFile: string
}

export const showStream = (options: ShowStreamOptions) => {
    let { repositoryId, command, res, pathToFile } = options;
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    command = `${command}${pathToFile}`;
    const gitProcess = spawn('git', [ gitDir, workTree, 'show', command ]);

    gitProcess.stderr.setEncoding('utf8');

    pipe({
        from: gitProcess,
        to: res,
        onStderrData(data) {
            console.error(data);
            gitProcess.stdout.unpipe(res);
            res.status(404).json({ error: data });
        },
        onStdoutError(err) {
            res.statusCode = 500;
            res.end('Server Error');
            console.error(err);
        }
    });
};

interface ShowFileContentOptions {
    repositoryId: string,
    command: string
}

export const showFileContent = async (options: ShowFileContentOptions) => {
    const { repositoryId, command } = options;
    const gitDir = getGitDirParam(repositoryId);
    const workTree = getWorkTreeParam(repositoryId);

    // eslint-disable-next-line no-return-await
    return exec(
        `git ${gitDir} ${workTree} show ${command}`
    );
};
