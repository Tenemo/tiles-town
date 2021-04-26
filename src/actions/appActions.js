import * as types from './actionTypes';

export function changeTheme(theme) {
    return {
        type: types.CHANGE_THEME,
        theme
    };
}