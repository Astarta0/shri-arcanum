const { assert } = require('chai');

describe('file search', () => {
    it('Поиск по файлам в директории - файлы найдены', function () {
        return this.browser
            .url('/')
            .assertExists('.search__input', 'Элемент search__input не отобразился')
            .leftClick('.search__input')
            .keys('package')
            .assertExists('//span[text() = \'package.json\']', 'Файл package.json не появился в списке')
            .assertView('filesTable', '.table');
    });

    it('Поиск по файлам в директории - файлы не найдены', function () {
        return this.browser
            .url('/')
            .assertExists('.search__input', 'Элемент search__input не отобразился')
            .leftClick('.search__input')
            .keys('piu')
            .assertExists('.filesTable__infoBlock', 'Элемент filesTable__infoBlock не появился на странице')
            .isExisting('.table')
            .then(isTableExist => {
                assert.equal(isTableExist, false, 'Елемент table со списком присутствует на странице');
            })
            .assertElementText('.filesTable__infoBlock', 'Sorry, no files found :c', 'Текст в блоке no files found не верный')
            .assertView('nofiles', '.filesTable__infoBlock');
    });
});
