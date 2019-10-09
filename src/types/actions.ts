import { Action as ReduxAction } from 'redux';
import { AppStateType } from './store';

export type getStateType = () => AppStateType;
export type ThunkDispatch = RawThunkDispatch<AppStateType, PlainAction>;

export type PlainAction = ReduxAction;
export type ThunkAction = (dispatch: ThunkDispatch, getState: () => AppStateType) => void;

// Generic типы
export type RawThunkDispatch<
    State,
    A extends ReduxAction,
    ExtraArgument = undefined
    > = (action: A | RawThunkAction<State, A, ExtraArgument>) => void;

export type RawThunkAction<State, A extends ReduxAction, ExtraArgument = undefined> = (
    dispatch: RawThunkDispatch<State, A, ExtraArgument>,
    getState: () => State,
    extraArgument: ExtraArgument
) => void;
