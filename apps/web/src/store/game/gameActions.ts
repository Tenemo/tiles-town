import {
    GAME_ROUTES,
    type HighScore,
    type NewGameResponse,
    type WinGameResponse,
    isHighScoresResponse,
    isNewGameResponse,
    isWinGameResponse,
} from '@tiles-town/contracts';
import axios from 'axios';
import { toast } from 'react-toastify';

import type { AppThunk } from 'store';
import { getGame } from 'store/game/gameSelectors';
import {
    beginRequest,
    lockBoard,
    makeMove,
    replaceGame,
    requestError,
    requestSuccess,
    restartBoard,
    setEasyMode,
    setHighScores,
    setNewSize,
    setPlayerName,
    setSeed,
    storeWin,
    unlockBoard,
} from 'store/game/gameReducer';
import { GameState } from 'store/game/gameTypes';
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

const describeUnexpectedResponse = (value: unknown): string => {
    if (
        typeof value === 'string' &&
        /<(?:!doctype|html|head|body)\b/i.test(value)
    ) {
        return 'Received HTML instead of JSON. Check the hardcoded API base URL or deployed /api routing.';
    }

    if (Array.isArray(value)) {
        return 'Received an array in an unexpected format.';
    }

    if (value && typeof value === 'object') {
        const keys = Object.keys(value as Record<string, unknown>);
        return keys.length
            ? `Received an object with keys: ${keys.join(', ')}.`
            : 'Received an empty object.';
    }

    return `Received ${typeof value}.`;
};

const assertHighScoresResponse = (value: unknown): HighScore[] => {
    if (!isHighScoresResponse(value)) {
        throw new Error(
            `Unexpected server response while loading high scores. ${describeUnexpectedResponse(
                value,
            )}`,
        );
    }

    return value;
};

const assertNewGameResponse = (value: unknown): NewGameResponse => {
    if (!isNewGameResponse(value)) {
        throw new Error(
            `Unexpected server response while loading a new game. ${describeUnexpectedResponse(
                value,
            )}`,
        );
    }

    return value;
};

const assertWinGameResponse = (value: unknown): WinGameResponse => {
    if (!isWinGameResponse(value)) {
        throw new Error(
            `Unexpected server response while saving the completed game. ${describeUnexpectedResponse(
                value,
            )}`,
        );
    }

    return value;
};

export {
    beginRequest,
    lockBoard,
    requestError,
    requestSuccess,
    restartBoard,
    setEasyMode,
    setNewSize,
    setPlayerName,
    setSeed,
    unlockBoard,
};

export const getHighScores =
    (): AppThunk<Promise<void>> =>
    async (dispatch): Promise<void> => {
        dispatch(beginRequest());
        try {
            const response = await request.get<HighScore[]>(
                GAME_ROUTES.highScores,
            );
            dispatch(setHighScores(assertHighScoresResponse(response.data)));
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
    (
        newSize: number,
        easyMode: boolean,
        seed: string,
        previousId: string,
    ): AppThunk<Promise<void>> =>
    async (dispatch, getState): Promise<void> => {
        const wasBoardDisabled = getGame(getState()).isDisabled;
        dispatch(lockBoard());
        dispatch(beginRequest());
        try {
            const response = await request.post<NewGameResponse>(
                GAME_ROUTES.newGame,
                {
                    size: newSize,
                    easyMode,
                    seed,
                    previousId,
                },
                {
                    timeout: 5000,
                },
            );
            const game = assertNewGameResponse(response.data);
            toast.success('New game loaded!', {
                autoClose: 1000,
                closeButton: false,
            });
            dispatch(replaceGame(game));
            dispatch(requestSuccess());
            // Wait for the rendered board to settle so the next click does not skip animations.
            setTimeout(() => dispatch(unlockBoard()), 20);
        } catch (error) {
            dispatch(requestError());
            if (!wasBoardDisabled) {
                dispatch(unlockBoard());
            }
            toast.error(
                `Couldn't load a new game.\n${getRequestErrorMessage(error)}`,
            );
            throw error;
        }
    };

export const winGame =
    (game: GameState): AppThunk<Promise<void>> =>
    async (dispatch): Promise<void> => {
        dispatch(beginRequest());

        try {
            const response = await request.put<WinGameResponse>(
                GAME_ROUTES.winGame(game.gameId),
                {
                    moves: game.moves,
                    playerName: game.playerName,
                },
                {
                    timeout: 20000,
                },
            );
            const receivedGame = assertWinGameResponse(response.data);
            const successMessage =
                typeof receivedGame.score === 'number'
                    ? `Total score: ${receivedGame.score}. Great job!`
                    : 'Great job!';
            toast.success(successMessage, {
                autoClose: 2000,
            });
            dispatch(lockBoard());
            dispatch(storeWin(receivedGame));
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
    (coords: string): AppThunk =>
    (dispatch, getState): void => {
        dispatch(makeMove(coords));
        const game = getGame(getState());
        if (game.leftCount === 0) {
            void dispatch(winGame(game));
        }
    };
