import { combineReducers } from 'redux';
import app from './appReducer';
import game from './gameReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';

const rootReducer = combineReducers({
    app,
    game,
    ajaxCallsInProgress
});

export default rootReducer;