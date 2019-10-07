/* eslint-disable no-tabs */
const { NoAnyRemoteBranchesError } = require('src/server/errors');

jest.mock('src/server/appData', () => ({
    FOLDER_PATH: '/'
}));

describe('git utils', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.doMock('child_process', () => jest.genMockFromModule('child_process'));
    });

    it('clone вызывается с верно сформированной командой', () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');
        gitUtils.clone('https://github.com/Astarta0/differentBranchesRepository.git', 'myfolder');
        expect(child_process.exec).toHaveBeenCalledWith(
            'GIT_TERMINAL_PROMPT=0 git clone https://github.com/Astarta0/differentBranchesRepository.git myfolder',
            expect.anything()
        );
    });

    it('checkout вызывается с верно сформированной командой', () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');
        gitUtils.checkout('repo1', 'master');
        expect(child_process.exec).toHaveBeenCalledWith(
            'git --git-dir=/repo1/.git --work-tree=/repo1 checkout --force master',
            expect.anything()
        );
    });

    it('pull вызывается с верно сформированной командой', () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');
        gitUtils.pull('repo1');
        expect(child_process.exec).toHaveBeenCalledWith(
            'git --git-dir=/repo1/.git --work-tree=/repo1 pull',
            expect.anything()
        );
    });

    it('fetch origin вызывается с верно сформированной командой', () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');
        gitUtils.fetchOrigin('repo1');
        expect(child_process.exec).toHaveBeenCalledWith(
            'git --git-dir=/repo1/.git --work-tree=/repo1 fetch origin',
            expect.anything()
        );
    });

    it('getAllRemoteBranches вызывается с верными параметрами', async () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');

        gitUtils.getAllRemoteBranches('repo1');
        expect(child_process.exec).toHaveBeenCalledWith(
            `git --git-dir=/repo1/.git --work-tree=/repo1 branch --remotes --format='%(refname:lstrip=-1)' | grep -v '^HEAD$'`,
            expect.anything()
        );
    });

    it('getAllRemoteBranches возвращает массив удаленных веток', async () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');

        child_process.exec.mockImplementation(
            (_, callback) => callback(null, { stdout: 'feature\nmaster' })
        );

        const branches = await gitUtils.getAllRemoteBranches('repo1');
        expect(branches).toEqual([ 'feature', 'master' ]);
    });

    it('defineMainBranchName вызывается с верными параметрами', async () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');

        gitUtils.defineMainBranchName('repo1');
        expect(child_process.exec).toHaveBeenCalledWith(
            `git --git-dir=/repo1/.git --work-tree=/repo1 symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'`,
            expect.anything()
        );
    });

    it('defineMainBranchName возвращает имя главной ветки', async () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');

        child_process.exec.mockImplementation(
            (_, callback) => callback(null, { stdout: 'master' })
        );

        const mainBranch = await gitUtils.defineMainBranchName('repo1');
        expect(mainBranch).toEqual('master');
    });

    it('defineMainBranchName вернет ошибку если главной ветки нет', async () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');

        child_process.exec.mockImplementation(
            (_, callback) => callback(null, { stdout: '' })
        );

        async function throwError() {
            await gitUtils.defineMainBranchName('repo1');
        }

        await expect(throwError()).rejects.toThrowError(
            new NoAnyRemoteBranchesError()
        );
    });

    it('getWorkingTree вызывается с верными параметрами', async () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');

        gitUtils.getWorkingTree('repo1', 'master', 'src/styles/');
        expect(child_process.exec).toHaveBeenCalledWith(
            `git --git-dir=/repo1/.git --work-tree=/repo1 ls-tree master src/styles/`,
            expect.anything()
        );
    });

    it('getWorkingTree вызывается для получения информации по файлам с верными параметрами', async () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');

        let firstCall = true;

        child_process.exec.mockImplementation(
            (command, callback) => {
                if (firstCall) {
                    firstCall = false;
                    return callback(null, { stdout:
                            '100644 blob a7a8b4bf1cff4cad2df7f48e5ef6771d3da9ce79	.gitignore\n'
                            + '100644 tree 8b137891791fe96927ad78e64b0aad7bded08bdc	EmptyFolder\n'
                            + '100644 blob 504d3ea4afa986ca47f67a80cb23324b6ea0601d	ISTQB_CTFL_Syllabus_2018-RU.pdf\n'
                            + '100644 blob 83d7a3e628a37cdbc658d4a18ea395eada60f8cd	README.md\n'
                    });
                } else {
                    return callback(null, { stdout: '' });
                }
            }
        );

        await gitUtils.getWorkingTree('repo1', 'master');

        const files = [
            { type: 'blob', name: '.gitignore' },
            { type: 'blob', name: 'EmptyFolder' },
            { type: 'blob', name: 'ISTQB_CTFL_Syllabus_2018-RU.pdf' },
            { type: 'blob', name: 'README.md' }
        ];

        for (let i = files.length; i > 0; i--) {
            expect(child_process.exec).toHaveBeenCalledWith(
                `git --git-dir=/repo1/.git --work-tree=/repo1 log --pretty=format:'%h%n%s%n%cN%n%cE%n%at%n' -n 1 master -- ${files[i - 1].name}`,
                expect.anything()
            );
        }
    });

    it('getWorkingTree возвращвет информацию по файлам', async () => {
        const child_process = require('child_process');
        const gitUtils = require('src/server/gitUtils');

        let isFirstCall = 1;

        child_process.exec.mockImplementation(
            (command, callback) => {
                if (isFirstCall) {
                    isFirstCall = false;
                    return callback(null, { stdout:
                            '100644 blob a7a8b4bf1cff4cad2df7f48e5ef6771d3da9ce79	.gitignore\n'
                            + '100644 tree 8b137891791fe96927ad78e64b0aad7bded08bdc	EmptyFolder\n'
                            + '100644 blob 504d3ea4afa986ca47f67a80cb23324b6ea0601d	ISTQB_CTFL_Syllabus_2018-RU.pdf\n'
                            + '100644 blob 83d7a3e628a37cdbc658d4a18ea395eada60f8cd	README.md\n'
                    });
                }
                return callback(null, { stdout: '6bbc992\n'
                        + 'change name of file\n'
                        + 'GitHub\n'
                        + 'noreply@github.com\n'
                        + '1569616461'
                });
            }
        );

        const filesInfo = await gitUtils.getWorkingTree('repo1', 'master');
        expect(filesInfo).toEqual([
            {
                name: '.gitignore',
                type: 'blob',
                commitHash: '6bbc992',
                commitMessage: 'change name of file',
                committerName: 'GitHub',
                committerEmail: 'noreply@github.com',
                date: '1569616461'
            },
            {
                name: 'EmptyFolder',
                type: 'tree',
                commitHash: '6bbc992',
                commitMessage: 'change name of file',
                committerName: 'GitHub',
                committerEmail: 'noreply@github.com',
                date: '1569616461'
            },
            {
                name: 'ISTQB_CTFL_Syllabus_2018-RU.pdf',
                type: 'blob',
                commitHash: '6bbc992',
                commitMessage: 'change name of file',
                committerName: 'GitHub',
                committerEmail: 'noreply@github.com',
                date: '1569616461'
            },
            {
                name: 'README.md',
                type: 'blob',
                commitHash: '6bbc992',
                commitMessage: 'change name of file',
                committerName: 'GitHub',
                committerEmail: 'noreply@github.com',
                date: '1569616461'
            }
        ]);
    });
});
