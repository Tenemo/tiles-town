import {
    GAME_ROUTES,
    type HighScore,
    type NewGameResponse,
    type WinGameResponse,
} from '@tiles-town/contracts';
import axios from 'axios';
import { toast } from 'react-toastify';

import { getGame } from 'store/game/gameSelectors';
import {
    GameState,
    GameActionTypes,
    GAME_REQUEST_ERROR,
    GAME_REQUEST_BEGIN,
    GAME_REQUEST_SUCCESS,
    NEW_GAME_SUCCESS,
    MAKE_MOVE,
    WIN_GAME_SUCCESS,
    UPDATE_ON_CHANGE,
    GET_HIGH_SCORES_SUCCESS,
    RESTART_BOARD,
    LOCK_BOARD,
    UNLOCK_BOARD,
} from 'store/game/gameTypes';
import { CommonDispatch, RootState } from 'store/types';
import request from 'utils/request';

const hasMessage = (value: unknown): value is { message: string } =>
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message?: unknown }).message === 'string';

const getRequestErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const statusPart =
            typeof error.response?.status === 'number'
                ? ` (HTTP ${error.response.status})`
                : '';
        const responseMessage = (() => {
            const responseData: unknown = error.response?.data;

            if (typeof responseData === 'string' && responseData.trim()) {
                return `: ${responseData.trim()}`;
            }

            if (hasMessage(responseData) && responseData.message.trim()) {
                return `: ${responseData.message.trim()}`;
            }

            return '';
        })();

        return `${error.message}${statusPart}${responseMessage}`;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
};

export const requestSuccess = (): GameActionTypes => ({
    type: GAME_REQUEST_SUCCESS,
});

export const beginRequest = (): GameActionTypes => ({
    type: GAME_REQUEST_BEGIN,
});

export const requestError = (): GameActionTypes => ({
    type: GAME_REQUEST_ERROR,
});

export const unlockBoard = (): GameActionTypes => ({
    type: UNLOCK_BOARD,
});

export const lockBoard = (): GameActionTypes => ({
    type: LOCK_BOARD,
});

export const restartBoard = (): GameActionTypes => ({
    type: RESTART_BOARD,
});

export const newGameSuccess = (newGame: NewGameResponse): GameActionTypes => ({
    type: NEW_GAME_SUCCESS,
    newGame,
});

export const makeMove = (move: string): GameActionTypes => ({
    type: MAKE_MOVE,
    move,
});

export const winGameSuccess = (game: WinGameResponse): GameActionTypes => ({
    type: WIN_GAME_SUCCESS,
    game,
});

export const updateOnChange = (
    name: string,
    value: string | boolean | number,
): GameActionTypes => ({
    type: UPDATE_ON_CHANGE,
    name,
    value,
});

export const getHighScoresSuccess = (
    highScores: HighScore[],
): GameActionTypes => ({
    type: GET_HIGH_SCORES_SUCCESS,
    highScores,
});

export const getHighScores =
    () =>
    async (dispatch: CommonDispatch): Promise<void> => {
        dispatch(beginRequest());
        try {
            const response = await request.get<HighScore[]>(
                GAME_ROUTES.highScores,
            );
            dispatch(getHighScoresSuccess(response.data));
            dispatch(requestSuccess());
        } catch (error) {
            dispatch(requestError());
            toast.error(
                `Couldn't load high scores from the server.\nMost likely Piotr turned off the server.\n${getRequestErrorMessage(
                    error,
                )}`,
            );
            throw error;
        }
    };

export const newGame =
    (newSize: number, easyMode: boolean, seed: string, previousId: string) =>
    async (dispatch: CommonDispatch): Promise<void> => {
        dispatch(lockBoard());
        dispatch(beginRequest());
        try {
            const response = await request.post<NewGameResponse>(
                GAME_ROUTES.newGame,
                JSON.stringify({
                    size: newSize,
                    easyMode,
                    seed,
                    previousId,
                }),
                {
                    timeout: 5000,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                },
            );
            toast.success('New game loaded!', {
                autoClose: 1000,
                closeButton: false,
            });
            dispatch(newGameSuccess(response.data));
            dispatch(requestSuccess());
            // wait for DOM a tiny bit to prevent flip animation, otherwise it bugs out
            setTimeout(() => dispatch(unlockBoard()), 20);
        } catch (error) {
            dispatch(requestError());
            toast.error(
                `Couldn't load a new game.\n${getRequestErrorMessage(error)}`,
            );
            throw error;
        }
    };

export const winGame =
    (game: GameState) =>
    async (dispatch: CommonDispatch): Promise<void> => {
        dispatch(beginRequest());

        try {
            const response = await request.put<WinGameResponse>(
                GAME_ROUTES.winGame(game.gameId),
                JSON.stringify({
                    moves: game.moves,
                    playerName: (() => {
                        if (!game.playerName) return 'anonymous';
                        return game.playerName;
                    })(),
                }),
                {
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    timeout: 20000,
                },
            );
            const receivedGame = response.data;
            const successMessage =
                typeof receivedGame.score === 'number'
                    ? `Total score: ${receivedGame.score}. Great job!`
                    : 'Great job!';
            toast.success(successMessage, {
                autoClose: 2000,
            });
            dispatch(lockBoard());
            dispatch(winGameSuccess(receivedGame));
            dispatch(requestSuccess());
            void dispatch(getHighScores());
        } catch (error) {
            dispatch(requestError());
            toast.error(
                `Request error, your game wasn't saved.\n${getRequestErrorMessage(
                    error,
                )}`,
            );
            throw error;
        }
    };

export const makeMoveCheckWin =
    (coords: string) =>
    (dispatch: CommonDispatch, getState: () => RootState): void => {
        dispatch(makeMove(coords));
        const game = getGame(getState());
        if (game.leftCount === 0) {
            void dispatch(winGame(game));
        }
    };
