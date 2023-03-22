import { AppState, AppActionTypes, APP_SET_THEME } from 'store/app/appTypes';

export const initialAppState: AppState = {
    theme: 'dark',
};

export const appReducer = (
    state = initialAppState,
    action: AppActionTypes,
): AppState => {
    switch (action.type) {
        case APP_SET_THEME:
            return {
                ...state,
                theme: action.payload.theme,
            };
        default:
            return state;
    }
};
