import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
} from 'react-redux';
import {
    combineReducers,
    configureStore,
    Dispatch,
    EnhancedStore,
    ThunkDispatch,
    UnknownAction,
} from '@reduxjs/toolkit';

import { appReducer } from 'store/app/appReducer';
import { gameReducer } from 'store/game/gameReducer';

const rootReducer = combineReducers({
    app: appReducer,
    game: gameReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
const configureAppStore = (): EnhancedStore<RootState> =>
    configureStore({
        reducer: rootReducer,
        devTools: import.meta.env.MODE !== 'production',
    });
export type AppStore = ReturnType<typeof configureAppStore>;

export const createAppStore = (): AppStore => configureAppStore();

export const store = createAppStore();

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction> &
    Dispatch<UnknownAction>;
export type AppThunk<ReturnType = void> = (
    dispatch: AppDispatch,
    getState: () => RootState,
) => ReturnType;

export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
export const useSelector = useReduxSelector.withTypes<RootState>();
