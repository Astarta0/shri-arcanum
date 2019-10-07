const { assert } = require('chai');

const TIMEOUT = 2000;

module.exports = (hermione, opts) => {
    hermione.on(hermione.events.NEW_BROWSER, browser => {
        browser.addCommand('assertExists', async (selector, msg) => {
            return browser.waitForExist(selector, TIMEOUT).isExisting(selector).then(exists => {
                assert.ok(exists, msg);
            });
        });
        browser.addCommand('assertElementText', async (selector, expectedText, msg) => {
            return browser.getText(selector).then(text => assert.strictEqual(text, expectedText, msg));
        });
        browser.addCommand('assertElementCssProperty', async (selector, cssProperty, expectedValue, msg) => {
            return browser.getCssProperty(selector, cssProperty)
                .then(cssProperty => {
                    assert.equal(cssProperty.value, expectedValue, msg);
                });
        });
    });
};
