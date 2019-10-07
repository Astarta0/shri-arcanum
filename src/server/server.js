import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import configureStore from 'src/store/configureStore';
import App from 'src/components/App';
import * as serverUtils from './serverUtils';
import { prepareState } from './middlewares';
import router from './routes/reposRouter';
import { getHTMLtemplate } from './ssr';

const app = express();

const { path: folderPath } = require('yargs')
    .usage('Usage: node $0 --path <path>')
    .option('p', {
        alias: 'path',
        describe: 'Absolute path to folder with repositories',
        coerce: serverUtils.checkFolderPath,
        demandOption: true
    })
    .fail((msg, err, yargs) => {
        console.error(msg, '\n');

        if (err) {
            console.error(err.stack || err.message);
        }

        console.error(yargs.help());
        process.exit(1);
    })
    .help()
    .alias('h', 'help').argv;

app.use('/static', express.static(`${__dirname}/../../static`));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/favicon.ico', (req, res) => {
    res.sendStatus(204);
});

app.use('/api/repos/', router);

// eslint-disable-next-line consistent-return
app.get('*', prepareState, (req, res) => {
    // This context object contains the results of the render
    const context = {};

    const preloadedState = req.state;
    const store = configureStore(preloadedState);

    // console.log( preloadedState.global );

    const appHtml = renderToStaticMarkup(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        </Provider>
    );

    if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(302, context.url);
    }

    if (context.status === 404) {
        res.status(404);
    }

    res.send(
        getHTMLtemplate({
            html: appHtml,
            state: store.getState()
        })
    );
});

app.use((err, req, res, next) => {
    const error = err.message || '500:\nSorry, it\'s me, not you!   🙀';
    res.status(500);
    res.set({ 'Content-Type': 'text/plain; charset=utf-8' });
    res.send(error);
});

serverUtils.serverInit({ folderPath, app });
