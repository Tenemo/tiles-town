import {
    GAME_ROUTES,
    type HighScore,
    type NewGameResponse,
    type WinGameResponse,
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
            dispatch(setHighScores(response.data));
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
    async (dispatch): Promise<void> => {
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
            toast.success('New game loaded!', {
                autoClose: 1000,
                closeButton: false,
            });
            dispatch(replaceGame(response.data));
            dispatch(requestSuccess());
            // Wait for the rendered board to settle so the next click does not skip animations.
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
            const receivedGame = response.data;
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
