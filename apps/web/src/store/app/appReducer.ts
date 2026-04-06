import { UnknownAction } from 'redux';

import { AppState, AppActionTypes, APP_SET_THEME } from 'store/app/appTypes';

type SetThemeAction = Extract<AppActionTypes, { type: typeof APP_SET_THEME }>;

export const initialAppState: AppState = {
    theme: 'dark',
};

export const appReducer = (
    state = initialAppState,
    action: AppActionTypes | UnknownAction,
): AppState => {
    switch (action.type) {
        case APP_SET_THEME: {
            const setThemeAction = action as SetThemeAction;
            return {
                ...state,
                theme: setThemeAction.payload.theme,
            };
        }
        default:
            return state;
    }
};
