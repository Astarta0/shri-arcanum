/* eslint-disable no-underscore-dangle */
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { AppStateType } from 'src/types/store';
import rootReducer from '../client/reducers/root';

/* global window */
const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const enhancer = composeEnhancers(applyMiddleware(thunk, logger));

export default function configureStore(preloadedState: AppStateType) {
    return createStore(rootReducer, preloadedState, enhancer);
}
/* eslint-enable */
