module.exports = {
    baseUrl: 'http://localhost:3000',
    gridUrl: 'http://localhost:4444/wd/hub',
    screenshotsDir: 'tests/hermione/screens',
    compositeImage: true,
    windowSize: '1200x760',
    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: "chrome"
            }
        },
        // firefox: {
        //     desiredCapabilities: {
        //         browserName: "firefox"
        //     }
        // }
    },
    sets: {
        all: {
            files: 'tests/hermione/*.js'
        }
    },
    plugins: {
        'html-reporter/hermione': {
            path: 'tests/hermione/reports'
        },
        'hermione-custom-commands': true
    }
};
