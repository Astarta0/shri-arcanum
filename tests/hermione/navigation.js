const { assert } = require('chai');

describe('navigation', () => {
    it('Переход по имени папки - обновление содержимого таблицы файлов', function () {
        return this.browser
            .url('/')
            .leftClick('//span[text() = \'.vscode\']')
            .pause(1000)
            .assertExists('//span[text() = \'launch.json\']', 'Файл launch.json не появился в списке')
            .assertView('filesTable', '.table');
    });

    it('Переход по имени папки - обновление url в браузере', function () {
        return this.browser
            .url('/')
            .leftClick('//span[text() = \'.vscode\']')
            .pause(1000)
            .getUrl()
            .then(url => {
                assert.equal(url, 'http://localhost:3000/subliminal/tree/master/.vscode', 'URL не обновился');
            });
    });

    it('Переход по имени папки - добавился breadcrumb', function () {
        return this.browser
            .url('/')
            .leftClick('//span[text() = \'.vscode\']')
            .pause(1000)
            .assertExists('.breadcrumbs__item_active', 'Не добавился breadcrumb')
            .assertElementText('.breadcrumbs__item_active', '.vscode', 'Текст breadcrumba не верный')
            .assertView('crumbs', '.breadcrumbs');
    });

    it('Переход по имени файла - добавился breadcrumb', function () {
        return this.browser
            .url('/')
            .leftClick('//span[text() = \'README.md\']')
            .pause(1000)
            .assertExists('.breadcrumbs__item_active', 'Не добавился breadcrumb')
            .assertElementText('.breadcrumbs__item_active', 'README.md', 'Текст breadcrumba не верный')
            .assertView('crumbs', '.breadcrumbs');
    });

    it('Переход по имени файла - обновление url в браузере', function () {
        return this.browser
            .url('/')
            .leftClick('//span[text() = \'README.md\']')
            .pause(1000)
            .getUrl()
            .then(url => {
                assert.equal(url, 'http://localhost:3000/subliminal/blob/master/README.md', 'URL не обновился');
            });
    });

    it('Переход по имени файла - отображение содержимого файла', function () {
        return this.browser
            .url('/')
            .leftClick('//span[text() = \'README.md\']')
            .pause(1000)
            .assertExists('.code-wrapper', 'Элемент code-wrapper не появился')
            .assertExists('.code-frame__title', 'Элемент .code-frame__title не появился')
            .assertElementText('.code-frame__title', 'README.md', 'Имя файла неверное')
            .assertView('codewrapper', '.code-wrapper');
    });

    it('Переход по имени файла - обновление табов', function () {
        return this.browser
            .url('/')
            .leftClick('//span[text() = \'README.md\']')
            .pause(1000)
            .assertExists('.tabs', 'Элемент tabs не появился')
            .assertElementText('.tabs__item_active', 'DETAILS', 'Имя активного таба неверное')
            .assertView('tabs', '.tabs');
    });

    it('Переход по crumb назад - обновление url', function () {
        let OldUrl;

        return this.browser
            .url('/')
            .leftClick('//span[text() = \'README.md\']')
            .pause(500)
            .getUrl()
            .then(url => {
                OldUrl = url;
            })
            .assertExists('.breadcrumbs', 'Элемент breadcrumbs не появился')
            .leftClick('.breadcrumbs__item:nth-child(1)')
            .getUrl()
            .then(url => {
                assert.notEqual(OldUrl, url, 'URL не обновился');
            });
    });

    it('Переход по crumb из отображения файла назад к просмотру списка файлов', function () {
        return this.browser
            .url('/')
            .leftClick('//span[text() = \'README.md\']')
            .pause(500)
            .assertExists('.breadcrumbs', 'Элемент breadcrumbs не появился')
            .leftClick('.breadcrumbs__item:nth-child(1)')
            .pause(1500)
            .assertView('tabs', '.tabs')
            .assertView('table', '.table');
    });
});
