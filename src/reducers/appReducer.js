import * as types from '../actions/actionTypes';
import initialState from './initialState';
import objectAssign from 'object-assign';

export default function gameReducer(state = initialState.app, action) {
    let newState;
    switch (action.type) {
        case types.CHANGE_THEME:
            newState = objectAssign({}, state);
            newState.theme = action.theme;
            if (action.theme === 'theme-dark') {
                newState.darkTheme = true;
            } else {
                newState.darkTheme = false;
            }
            return newState;
        default:
            return state;
    }
}