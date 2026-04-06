import { UnknownAction } from 'redux';

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

type NewGameSuccessAction = Extract<
    GameActionTypes,
    { type: typeof NEW_GAME_SUCCESS }
>;
type MakeMoveAction = Extract<GameActionTypes, { type: typeof MAKE_MOVE }>;
type WinGameSuccessAction = Extract<
    GameActionTypes,
    { type: typeof WIN_GAME_SUCCESS }
>;
type UpdateOnChangeAction = Extract<
    GameActionTypes,
    { type: typeof UPDATE_ON_CHANGE }
>;
type GetHighScoresSuccessAction = Extract<
    GameActionTypes,
    { type: typeof GET_HIGH_SCORES_SUCCESS }
>;

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
    action: GameActionTypes | UnknownAction,
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
        case NEW_GAME_SUCCESS: {
            const newGameAction = action as NewGameSuccessAction;
            newState = { ...state };
            newState.board = newGameAction.newGame.board;
            newState.receivedBoard = JSON.parse(
                JSON.stringify(newState.board),
            ) as number[][];
            newState.gameId = newGameAction.newGame.gameId;
            newState.size = newGameAction.newGame.size;
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
        }
        case MAKE_MOVE: {
            const makeMoveAction = action as MakeMoveAction;
            newState = { ...state };
            newState.moves = newState.moves.concat(makeMoveAction.move);
            newState.moveCount += 1;
            newState = updateBoard(
                JSON.parse(JSON.stringify(newState)) as GameState,
                makeMoveAction.move,
            );
            return newState;
        }
        case WIN_GAME_SUCCESS: {
            const winGameAction = action as WinGameSuccessAction;
            newState = { ...state };
            newState.previous = {
                size: newState.size,
                seed: winGameAction.game.seed ?? '',
                moveCount: winGameAction.game.moveCount ?? null,
                time: winGameAction.game.time ?? null,
                score: winGameAction.game.score ?? null,
                gameId: newState.gameId,
                easyMode: newState.easyMode,
                isSeedCustom: winGameAction.game.isSeedCustom ?? null,
                playerName: newState.playerName,
                moves: [],
            };
            newState.previous.moves = JSON.parse(
                JSON.stringify(newState.moves),
            ) as string[];
            newState.moves = [];
            newState.moveCount = 0;
            newState.gameId = '';
            return newState;
        }
        case UPDATE_ON_CHANGE: {
            const updateOnChangeAction = action as UpdateOnChangeAction;
            newState = {
                ...state,
                [updateOnChangeAction.name]: updateOnChangeAction.value,
            } as GameState;
            return newState;
        }
        case GET_HIGH_SCORES_SUCCESS: {
            const getHighScoresSuccessAction =
                action as GetHighScoresSuccessAction;
            newState = { ...state };
            newState.highScores = getHighScoresSuccessAction.highScores;
            return newState;
        }
        case RESTART_BOARD:
            newState = { ...state };
            newState.board = JSON.parse(
                JSON.stringify(newState.receivedBoard),
            ) as number[][];
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
