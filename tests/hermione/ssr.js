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
});
