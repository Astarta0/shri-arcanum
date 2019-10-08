/* global window, document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import 'src/client/css/index.css';

import App from 'src/components/App';
import history from 'src/history';
import configureStore from '../store/configureStore';

// eslint-disable-next-line no-underscore-dangle
const preloadedState = window.__PRELOADED_STATE__;

const store = window.store = configureStore(preloadedState);

const { hydrate } = ReactDOM;

hydrate(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
