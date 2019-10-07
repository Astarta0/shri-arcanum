const config = {
    development: {
        api: {
            apiBaseUrl: '/api/repos/'
        },
        server: {
            port: 3000
        }
    },
    production: {
        api: {
            apiBaseUrl: '/api/repos/'
        },
        server: {
            port: 80
        }
    }
};

export default config;
