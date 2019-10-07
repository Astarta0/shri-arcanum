import fs from 'fs';
import express from 'express';
import request from 'supertest';
import router from 'src/server/routes/reposRouter';
import bodyParser from 'body-parser';
import rimraf from 'rimraf';

jest.mock('fs');
jest.mock('rimraf');
jest.mock('src/server/gitUtils');

jest.mock('src/server/appData', () => ({
    FOLDER_PATH: '/'
}));

const initApp = () => {
    const app = express();
    app.use(bodyParser.json());
    app.use('/api/repos/', router);
    app.use((err, req, res, next) => {
        console.error(err);
    });
    return app;
};

describe('API', () => {
    it('GET / Возвращает массив репозиториев в папке', () => {
        fs._setup({
            repo1: {},
            repo2: {}
        });
        const app = initApp();
        return request(app).get('/api/repos/')
            .expect(200)
            .expect('{"folders":["repo1","repo2"]}');
    });

    it('POST / Добавляет репозиторий в список', () => {
        fs._setup({
            repo1: {},
            repo2: {}
        });
        const app = initApp();
        return request(app)
            .post('/api/repos/myrepo')
            .send({ url: 'https://github.com/User/myrepo' })
            .expect(200)
            .expect('{"status":"OK"}');
    });

    it('DELETE /:repositoryId Безвозвратно удаляет репозиторий', () => {
        fs._setup({
            repo1: {},
            repo2: {}
        });
        const app = initApp();
        rimraf.mockImplementation((path, callback) => callback());
        return request(app)
            .delete('/api/repos/myrepo')
            .expect(200)
            .expect('{"status":"OK"}');
    });

    it('GET /:repositoryId Возвращает содержимое репозитория в корне на главной ветке', () => {
        const app = initApp();
        fs._setup({
            repo1: {
                folder: {
                    'file.txt': 'asd'
                },
                'text.txt': 'asd asd'
            }
        });
        return request(app)
            .get('/api/repos/repo1')
            .expect(200)
            // eslint-disable-next-line max-len
            .expect('{"files":[{"name":"folder","type":"tree","commitHash":"ae56c1de","commitMessage":"message","committerName":"user","committerEmail":"user@server.com","date":1570305287710},{"name":"text.txt","type":"blob","commitHash":"ae56c1de","commitMessage":"message","committerName":"user","committerEmail":"user@server.com","date":1570305287710}]}');
    });

    it('GET /:repositoryId/tree/master/:path Возвращает содержимое репозитоория по указанному пути', () => {
        const app = initApp();
        fs._setup({
            repo1: {
                folder: {
                    'file.txt': 'asd'
                },
                folder2: {
                    'buka.txt': 'content',
                    innerFolder: {
                        'some.txt': 'hello'
                    }
                },
                'text.txt': 'asd asd'
            }
        });
        return request(app)
            .get('/api/repos/repo1/tree/master/folder2/innerFolder')
            .expect(200)
            .expect('{"files":[{"name":"some.txt","type":"blob","commitHash":"ae56c1de","commitMessage":"message","committerName":"user","committerEmail":"user@server.com","date":1570305287710}]}');
    });

    it('GET /:repositoryId/blob/master/:path Возвращает содержимое файла по указанному пути', () => {
        const app = initApp();
        fs._setup({
            repo1: {
                folder: {
                    'file.txt': 'asd'
                },
                folder2: {
                    'buka.txt': 'content',
                    innerFolder: {
                        some: 'hello'
                    }
                },
                'text.txt': 'asd asd'
            }
        });
        return request(app)
            .get('/api/repos/repo1/blob/master/folder2/innerFolder/some')
            .expect(200)
            .expect('hello');
    });
});
