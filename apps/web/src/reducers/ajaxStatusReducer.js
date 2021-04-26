import * as types from '../actions/actionTypes';
import initialState from './initialState';

function actionTypeEndsInSuccess(type) {
    return type.substring(type.length - 8) == '_SUCCESS';
}

export default function ajaxStatusReducer(state = initialState.ajaxCallsInProgress, action) {
    if (action.type == types.BEGIN_AJAX_CALL) {
        //console.log('REDUCER BEGIN_AJAX_CALL, ajaxCallsInProgress = ' + (state + 1));
        return state + 1;
    } else if (action.type == types.AJAX_CALL_ERROR || actionTypeEndsInSuccess(action.type)) {
        //console.log('REDUCER _SUCCESS, ajaxCallsInProgress = ' + (state - 1));
        return state - 1;
    }

    return state;
}
