import { combineReducers, Reducer } from 'redux';

import { AppStateType } from 'src/types/store';
import globalReducer from './global';

const rootReducer = combineReducers({
    global: globalReducer,
});

export default rootReducer;
