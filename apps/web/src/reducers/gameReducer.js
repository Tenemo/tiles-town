import * as types from '../actions/actionTypes';
import initialState from './initialState';
import objectAssign from 'object-assign';
import { updateBoard } from '../helpers/helpers';

export default function gameReducer(state = initialState.game, action) {
    let newState;
    switch (action.type) {
        case types.NEW_GAME_SUCCESS:
            newState = objectAssign({}, state);
            newState.board = action.newGame.board;
            newState.receivedBoard = JSON.parse(JSON.stringify(newState.board));
            newState.gameId = action.newGame.gameId;
            newState.size = action.newGame.size;
            newState.leftCount = 0;
            newState.moves = [];
            newState.moveCount = 0;
            for (let i = 0; i < newState.board.length; ++i) {
                for (let j = 0; j < newState.board[i].length; ++j) {
                    if (newState.board[i][j] == 1)
                        newState.leftCount++;
                }
            }
            newState.firstTime = false;
            return newState;
        case types.MAKE_MOVE:
            newState = objectAssign({}, state);
            newState.moves = newState.moves.concat(action.move);
            newState.moveCount++;
            newState = updateBoard(JSON.parse(JSON.stringify(newState)), action.move);
            return newState;
        case types.WIN_GAME_SUCCESS:
            newState = objectAssign({}, state);
            newState.previous = {
                size: newState.size,
                seed: action.game.seed,
                moveCount: action.game.moveCount,
                time: action.game.time,
                score: action.game.score,
                gameId: newState.gameId,
                easyMode: newState.easyMode,
                isSeedCustom: action.game.isSeedCustom,
                playerName: newState.playerName,
            };
            newState.previous.moves = JSON.parse(JSON.stringify(newState.moves));
            newState.moves = [];
            newState.moveCount = 0;
            newState.gameId = '';
            return newState;
        case types.UPDATE_ON_CHANGE:
            newState = objectAssign({}, state);
            newState[action.name] = action.value;
            return newState;
        case types.GET_HIGH_SCORES_SUCCESS:
            newState = objectAssign({}, state);
            newState.highScores = action.highScores;
            return newState;
        case types.RESTART_BOARD:
            newState = objectAssign({}, state);
            newState.board = JSON.parse(JSON.stringify(newState.receivedBoard));
            newState.moves = [];
            newState.moveCount = 0;
            newState.leftCount = 0;
            for (let i = 0; i < newState.board.length; ++i) {
                for (let j = 0; j < newState.board[i].length; ++j) {
                    if (newState.board[i][j] == 1)
                        newState.leftCount++;
                }
            }
            return newState;
        case types.LOCK_BOARD:
            newState = objectAssign({}, state);
            newState.isDisabled = true;
            return newState;
        case types.UNLOCK_BOARD:
            newState = objectAssign({}, state);
            newState.isDisabled = false;
            return newState;
        default:
            return state;
    }
}