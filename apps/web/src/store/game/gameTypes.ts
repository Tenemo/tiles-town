export const NEW_GAME_SUCCESS = 'NEW_GAME_SUCCESS';
export const MAKE_MOVE = 'MAKE_MOVE';
export const WIN_GAME_SUCCESS = 'WIN_GAME_SUCCESS';
export const UPDATE_ON_CHANGE = 'UPDATE_ON_CHANGE';
export const GET_HIGH_SCORES_SUCCESS = 'GET_HIGH_SCORES_SUCCESS';
export const RESTART_BOARD = 'RESTART_BOARD';
export const LOCK_BOARD = 'LOCK_BOARD';
export const UNLOCK_BOARD = 'UNLOCK_BOARD';
export const GAME_REQUEST_ERROR = 'GAME_REQUEST_ERROR';
export const GAME_REQUEST_BEGIN = 'GAME_REQUEST_BEGIN';
export const GAME_REQUEST_SUCCESS = 'GAME_REQUEST_SUCCESS';

const defaultSize = 6;
const defaultBoard: number[][] = [];
for (let i = 0; i < defaultSize; i += 1) {
    defaultBoard.push([]);
    for (let j = 0; j < defaultSize; j += 1) {
        defaultBoard[i].push(0);
    }
}

export type HighScore = {
    game_score: number;
    game_player_name: string;
    game_size: number;
    game_move_count: number;
    game_time: number;
};

// TODO: remove | nulls, add proper initial values
export type GameState = {
    requestsCount: number;
    board: number[][];
    receivedBoard: number[][];
    size: number;
    newSize: number;
    leftCount: number | null;
    playerName: string;
    gameId: string;
    moveCount: number;
    moves: string[];
    seed: string;
    time?: number;
    score?: number;
    isSeedCustom?: boolean;
    easyMode: boolean;
    highScores: HighScore[];
    isDisabled: boolean;
    firstTime: boolean;
    previous: {
        size: number | null;
        seed: string;
        moveCount: number | null;
        time: number | null;
        score: number | null;
        gameId: string;
        easyMode: boolean | null;
        isSeedCustom: boolean | null;
        playerName: string;
        moves: string[];
    };
};

type gameRequestBeginAction = {
    type: typeof GAME_REQUEST_BEGIN;
};
type gameRequestErrorAction = {
    type: typeof GAME_REQUEST_ERROR;
};
type gameRequestSuccessAction = {
    type: typeof GAME_REQUEST_SUCCESS;
};
type newGameSuccessAction = {
    type: typeof NEW_GAME_SUCCESS;
    newGame: GameState;
};
type unlockBoardAction = {
    type: typeof UNLOCK_BOARD;
};
type lockBoardAction = {
    type: typeof LOCK_BOARD;
};
type makeMoveAction = {
    type: typeof MAKE_MOVE;
    move: string;
};
type winGameSuccessAction = {
    type: typeof WIN_GAME_SUCCESS;
    game: GameState;
};
type updateOnChangeAction = {
    type: typeof UPDATE_ON_CHANGE;
    name: string;
    value: string;
};
type getHighScoresSuccessAction = {
    type: typeof GET_HIGH_SCORES_SUCCESS;
    highScores: HighScore[];
};
type restartBoardAction = {
    type: typeof RESTART_BOARD;
};

export type GameActionTypes =
    | gameRequestBeginAction
    | gameRequestErrorAction
    | gameRequestSuccessAction
    | newGameSuccessAction
    | unlockBoardAction
    | lockBoardAction
    | makeMoveAction
    | winGameSuccessAction
    | updateOnChangeAction
    | getHighScoresSuccessAction
    | restartBoardAction;
