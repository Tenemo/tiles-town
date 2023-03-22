import { COLOR_VARIABLES } from 'constants/appConstants';
import { AppActionTypes, AppTheme, APP_SET_THEME } from 'store/app/appTypes';

export const setTheme = (theme: AppTheme): AppActionTypes => {
    const root = document.querySelector(':root') as HTMLElement;
    COLOR_VARIABLES.forEach((colorVariable) =>
        root.style.setProperty(
            `--${colorVariable}`,
            `var(--${theme}-${colorVariable})`,
        ),
    );
    return {
        type: APP_SET_THEME,
        payload: { theme },
    };
};
