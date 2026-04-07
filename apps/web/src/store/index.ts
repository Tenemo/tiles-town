import { composeWithDevTools } from '@redux-devtools/extension';
import { createBrowserHistory } from 'history';
import {
    TypedUseSelectorHook,
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
} from 'react-redux';
import {
    Store,
    legacy_createStore,
    applyMiddleware,
    compose,
    combineReducers,
    AnyAction,
    Middleware,
} from 'redux';
import { createReduxHistoryContext } from 'redux-first-history';
import { thunk, ThunkDispatch, ThunkMiddleware } from 'redux-thunk';

import { BUILD_TYPE } from 'constants/appConstants';
import { appReducer, initialAppState } from 'store/app/appReducer';
import { gameReducer, initialGameState } from 'store/game/gameReducer';
import { AllActions, RootState } from 'store/types';

const { createReduxHistory, routerMiddleware, routerReducer } =
    createReduxHistoryContext({
        history: createBrowserHistory(),
    });

export const initialState: RootState = {
    router: routerReducer(undefined, { type: '@@INIT' } as AnyAction),
    app: initialAppState,
    game: initialGameState,
};

const rootReducer = combineReducers({
    router: routerReducer,
    app: appReducer,
    game: gameReducer,
});

const configureStoreDev = (): Store<RootState> => {
    const middleware: Middleware[] = [
        thunk as ThunkMiddleware<RootState, AllActions>,
        routerMiddleware,
    ];
    return legacy_createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware)),
    );
};
const configureStoreProd = (): Store<RootState> => {
    const middleware: Middleware[] = [
        thunk as ThunkMiddleware<RootState, AllActions>,
        routerMiddleware,
    ];
    return legacy_createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware)),
    );
};
const configureStore =
    BUILD_TYPE === `production` ? configureStoreProd : configureStoreDev;

export const store = configureStore();
export const history = createReduxHistory(store);

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export const useDispatch: () => AppDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
