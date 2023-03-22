import { RouterState } from 'redux-first-history';
import { ThunkDispatch } from 'redux-thunk';

import { AppState, AppActionTypes } from 'store/app/appTypes';
import { GameState, GameActionTypes } from 'store/game/gameTypes';

export type RootState = {
    readonly router: RouterState;
    readonly app: AppState;
    readonly game: GameState;
};

export type AllActions = AppActionTypes | GameActionTypes;
export type CommonDispatch = ThunkDispatch<RootState, unknown, AllActions>;
