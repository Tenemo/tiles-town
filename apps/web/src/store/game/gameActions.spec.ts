import type { NewGameResponse } from '@tiles-town/contracts';
import { AppDispatch, createAppStore } from 'store';

import {
    makeMove,
    replaceGame,
    setPlayerName,
    unlockBoard,
} from './gameReducer';
import { getHighScores, newGame, winGame } from './gameActions';

const existingGame: NewGameResponse = {
    board: [
        [1, 0, 1, 0],
        [0, 1, 0, 1],
        [1, 1, 0, 0],
        [0, 0, 1, 1],
    ],
    gameId: '0123456789abcdef0123456789abcdef',
    size: 4,
};

const prepareActiveGameStore = (): ReturnType<typeof createAppStore> => {
    const store = createAppStore();

    store.dispatch(replaceGame(existingGame));
    store.dispatch(unlockBoard());
    store.dispatch(setPlayerName('Test player'));

    return store;
};

const mocks = vi.hoisted(() => ({
    requestGet: vi.fn(),
    requestPost: vi.fn(),
    requestPut: vi.fn(),
    toastError: vi.fn(),
    toastSuccess: vi.fn(),
}));

vi.mock('utils/request', () => ({
    default: {
        get: mocks.requestGet,
        post: mocks.requestPost,
        put: mocks.requestPut,
    },
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: mocks.toastError,
        success: mocks.toastSuccess,
    },
}));

describe('gameActions', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('rejects malformed high score responses without corrupting state', async () => {
        mocks.requestGet.mockResolvedValue({
            data: '<!DOCTYPE html><html><body>Not JSON</body></html>',
        });

        const store = createAppStore();
        const dispatch = store.dispatch as AppDispatch;

        await expect(dispatch(getHighScores())).rejects.toThrow(
            'Unexpected server response while loading high scores. Received HTML instead of JSON. Check the hardcoded API base URL or deployed /api routing.',
        );

        expect(store.getState().game.highScores).toEqual([]);
        expect(mocks.toastError).toHaveBeenCalledWith(
            expect.stringContaining(
                'Unexpected server response while loading high scores.',
            ),
        );
    });

    it('rejects malformed new game responses without replacing the current board', async () => {
        mocks.requestPost.mockResolvedValue({
            data: '<!DOCTYPE html><html><body>Not JSON</body></html>',
        });

        const store = prepareActiveGameStore();
        const dispatch = store.dispatch as AppDispatch;
        const previousGame = store.getState().game;

        await expect(
            dispatch(
                newGame(
                    previousGame.size,
                    previousGame.easyMode,
                    previousGame.seed,
                    previousGame.gameId,
                ),
            ),
        ).rejects.toThrow(
            'Unexpected server response while loading a new game. Received HTML instead of JSON. Check the hardcoded API base URL or deployed /api routing.',
        );

        expect(store.getState().game).toMatchObject({
            board: previousGame.board,
            receivedBoard: previousGame.receivedBoard,
            gameId: previousGame.gameId,
            size: previousGame.size,
            moves: previousGame.moves,
            moveCount: previousGame.moveCount,
            requestsCount: 0,
            isDisabled: false,
        });
        expect(mocks.toastError).toHaveBeenCalledWith(
            expect.stringContaining(
                'Unexpected server response while loading a new game.',
            ),
        );
        expect(mocks.toastSuccess).not.toHaveBeenCalled();
    });

    it("rejects malformed win responses without overwriting the current game's progress", async () => {
        mocks.requestPut.mockResolvedValue({
            data: '<!DOCTYPE html><html><body>Not JSON</body></html>',
        });

        const store = prepareActiveGameStore();
        store.dispatch(makeMove('A1'));
        const dispatch = store.dispatch as AppDispatch;
        const previousGame = store.getState().game;

        await expect(dispatch(winGame(previousGame))).rejects.toThrow(
            'Unexpected server response while saving the completed game. Received HTML instead of JSON. Check the hardcoded API base URL or deployed /api routing.',
        );

        expect(store.getState().game).toMatchObject({
            board: previousGame.board,
            receivedBoard: previousGame.receivedBoard,
            gameId: previousGame.gameId,
            size: previousGame.size,
            moves: previousGame.moves,
            moveCount: previousGame.moveCount,
            previous: previousGame.previous,
            requestsCount: 0,
            isDisabled: false,
        });
        expect(mocks.toastError).toHaveBeenCalledWith(
            expect.stringContaining("Request error, your game wasn't saved."),
        );
        expect(mocks.toastSuccess).not.toHaveBeenCalled();
    });
});
