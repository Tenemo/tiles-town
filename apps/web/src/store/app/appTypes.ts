export const APP_SET_THEME = 'APP_SET_THEME';

export type AppTheme = 'dark' | 'light';

export type AppState = {
    theme: string;
};

type SetThemeAction = {
    type: typeof APP_SET_THEME;
    payload: {
        theme: AppTheme;
    };
};
export type AppActionTypes = SetThemeAction;
