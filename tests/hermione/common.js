const { assert } = require('chai');

describe('init page', () => {
    it('Переход на /', function () {
        return this.browser
            .url('/')
            .assertExists('.dropDown', 'DropDown не отобразился')
            .assertElementText('.dropDown__label + span', 'subliminal', 'Неверно выбран репозиторий по умолчанию в DropDown')
            .assertExists('.breadcrumbs', 'breadcrumbs не отобразился')
            .assertElementText('.breadcrumbs__item_active', 'subliminal', 'Неверное имя репозитория по умолчанию в активном breadcrumbe ')
            .assertExists('.info', 'info не отобразился')
            .assertExists('.tabs', 'tabs не отобразился')
            .assertElementText('.tabs__item_active', 'FILES', 'Неверный текст активной вкладки по умолчанию')
            .assertExists('.table', 'table не отобразился')
            .assertView('initpage', 'body', { allowViewportOverflow: true });
    });

    it('Раскрытие dropDown - показывается select', function () {
        return this.browser
            .url('/')
            .assertExists('.dropDown', 'DropDown не отобразился')
            .assertExists('.dropDown__select', 'Select элемент отсутствует в DOM')
            .leftClick('.dropDown')
            .assertElementCssProperty('.dropDown__select', 'display', 'block', 'dropDown__select не стал видимым')
            .assertView('select', '.dropDown__select');
    });

    it('Раскрытие dropDown - select содержит репозитории', function () {
        return this.browser
            .url('/')
            .assertExists('.dropDown', 'DropDown не отобразился')
            .assertExists('.dropDown__select', 'Select элемент отсутствует в DOM')
            .leftClick('.dropDown')
            .assertElementText('.select li:nth-child(1)', 'subliminal', 'Неверный текст первого репозитория в селекте')
            .assertElementText('.select li:nth-child(2)', 'todos', 'Неверный текст второго репозитория в селекте')
            .assertView('select', '.dropDown__select');
    });

    it('Выбор пункта из select скрывает селект', function () {
        return this.browser
            .url('/')
            .assertExists('.dropDown', 'DropDown не отобразился')
            .assertExists('.dropDown__select', 'Select элемент отсутствует в DOM')
            .leftClick('.dropDown')
            .waitForVisible('.dropDown__select', 500, false)
            .leftClick('.select li:nth-child(2)')
            .waitForVisible('.dropDown__select', 1000, true)
            .assertElementCssProperty('.dropDown__select', 'display', 'none', 'dropDown__select не скрылся')
            .pause(2000)
            .assertView('page', 'body');
    });

    it('Выбор другого репозитория из select обновляет данные', function () {
        return this.browser
            .url('/')
            .assertExists('.dropDown', 'DropDown не отобразился')
            .assertExists('.dropDown__select', 'Select элемент отсутствует в DOM')
            .leftClick('.dropDown')
            .assertElementCssProperty('.dropDown__select', 'display', 'block', 'dropDown__select не стал видимым')
            .leftClick('.select li:nth-child(2)')
            .waitForVisible('.dropDown__select', 300, true)
            .pause(2000)
            .assertView('page', 'body');
    });
});
