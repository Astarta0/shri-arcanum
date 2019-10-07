const { assert } = require('chai');

describe('ssr', () => {
    it('Открыть содержимое папки по прямой ссылке', function () {
        return this.browser
            .url('/todos/tree/master/src/components')
            .pause(3000)
            .assertElementText('.dropDown__label + span', 'todos', 'Неверно установлен выбранный репозиторий в dropdown')
            .assertElementText('.breadcrumbs__item_active', 'components', 'Неверный активный breadcrumb')
            .assertElementText('//*[contains(@class, \'info__title\')]/*[1]', 'todos', 'Неверный ркпозиторий в блоке info')
            .assertExists('.table', 'Элемент code-wrapper не появился')
            .assertView('page', 'body');
    });

    it('Открыть содержимое файла по прямой ссылке', function () {
        return this.browser
            .url('/todos/blob/master/src/components/App.js')
            .pause(3000)
            .assertElementText('.dropDown__label + span', 'todos', 'Неверно установлен выбранный репозиторий в dropdown')
            .assertElementText('.breadcrumbs__item_active', 'App.js', 'Неверный активный breadcrumb')
            .assertElementText('//*[contains(@class, \'info__title\')]/*[1]', 'todos', 'Неверный ркпозиторий в блоке info')
            .assertExists('.code-wrapper', 'Элемент code-wrapper не появился')
            .assertView('page', 'body');
    });

    it('Открыть содержимое не существующего файла по прямой ссылке - отображение 404', function () {
        return this.browser
            .url('/todos/blob/master/src/components/NotFoundedComponent.js')
            .pause(3000)
            .assertExists('.notFound', 'Элемент notFound не появился')
            .getUrl()
            .then(url => {
                assert.equal(url, 'http://localhost:3000/notFound', 'URL не соответствует 404 странице');
            })
            .assertView('notFound', '.notFound');
    });

    it('Открыть содержимое по несуществующему пути - no files found', function () {
        return this.browser
            .url('/todos/tree/master/src/actions/global')
            .pause(3000)
            .assertExists('.filesTable__infoBlock', 'Элемент filesTable__infoBlock не появился')
            .assertElementText('.filesTable__infoBlock', 'No files', 'Не верный текст в элементе filesTable__infoBlock')
            .assertView('notFound', '.filesTable__infoBlock');
    });
});
