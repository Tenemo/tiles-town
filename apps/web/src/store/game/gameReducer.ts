import {
    GameState,
    GameActionTypes,
    GAME_REQUEST_ERROR,
    GAME_REQUEST_SUCCESS,
    GAME_REQUEST_BEGIN,
    NEW_GAME_SUCCESS,
    MAKE_MOVE,
    WIN_GAME_SUCCESS,
    UPDATE_ON_CHANGE,
    GET_HIGH_SCORES_SUCCESS,
    RESTART_BOARD,
    LOCK_BOARD,
    UNLOCK_BOARD,
} from 'store/game/gameTypes';
import { updateBoard } from 'utils/helpers';

const defaultSize = 6;
const defaultBoard: number[][] = [];
for (let i = 0; i < defaultSize; i += 1) {
    defaultBoard.push([]);
    for (let j = 0; j < defaultSize; j += 1) {
        defaultBoard[i].push(0);
    }
}

export const initialGameState: GameState = {
    requestsCount: 0,
    board: defaultBoard,
    receivedBoard: [],
    size: defaultSize,
    newSize: defaultSize,
    leftCount: null,
    playerName: '',
    gameId: '',
    moveCount: 0,
    moves: [],
    seed: '',
    easyMode: false,
    highScores: [],
    isDisabled: true,
    firstTime: true,
    previous: {
        size: null,
        seed: '',
        moveCount: null,
        time: null,
        score: null,
        gameId: '',
        easyMode: null,
        isSeedCustom: null,
        playerName: '',
        moves: [],
    },
};

export const gameReducer = (
    state = initialGameState,
    action: GameActionTypes,
): GameState => {
    let newState: GameState;
    switch (action.type) {
        case GAME_REQUEST_BEGIN:
            return {
                ...state,
                requestsCount: state.requestsCount + 1,
            };
        case GAME_REQUEST_ERROR:
            return {
                ...state,
                requestsCount: state.requestsCount - 1,
            };
        case GAME_REQUEST_SUCCESS:
            return {
                ...state,
                requestsCount: state.requestsCount - 1,
            };
        case NEW_GAME_SUCCESS:
            newState = { ...state };
            newState.board = action.newGame.board;
            newState.receivedBoard = JSON.parse(JSON.stringify(newState.board));
            newState.gameId = action.newGame.gameId;
            newState.size = action.newGame.size;
            newState.leftCount = 0;
            newState.moves = [];
            newState.moveCount = 0;
            for (let i = 0; i < newState.board.length; ++i) {
                for (let j = 0; j < newState.board[i].length; ++j) {
                    if (newState.board[i][j] === 1) newState.leftCount++;
                }
            }
            newState.firstTime = false;
            return newState;
        case MAKE_MOVE:
            newState = { ...state };
            newState.moves = newState.moves.concat(action.move);
            newState.moveCount++;
            newState = updateBoard(
                JSON.parse(JSON.stringify(newState)),
                action.move,
            );
            return newState;
        case WIN_GAME_SUCCESS:
            newState = { ...state };
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
            newState.previous.moves = JSON.parse(
                JSON.stringify(newState.moves),
            );
            newState.moves = [];
            newState.moveCount = 0;
            newState.gameId = '';
            return newState;
        case UPDATE_ON_CHANGE:
            newState = { ...state };
            newState[action.name] = action.value;
            return newState;
        case GET_HIGH_SCORES_SUCCESS:
            newState = { ...state };
            newState.highScores = action.highScores;
            return newState;
        case RESTART_BOARD:
            newState = { ...state };
            newState.board = JSON.parse(JSON.stringify(newState.receivedBoard));
            newState.moves = [];
            newState.moveCount = 0;
            newState.leftCount = 0;
            for (let i = 0; i < newState.board.length; ++i) {
                for (let j = 0; j < newState.board[i].length; ++j) {
                    if (newState.board[i][j] === 1) newState.leftCount++;
                }
            }
            return newState;
        case LOCK_BOARD:
            newState = { ...state };
            newState.isDisabled = true;
            return newState;
        case UNLOCK_BOARD:
            newState = { ...state };
            newState.isDisabled = false;
            return newState;
        default:
            return state;
    }
};
