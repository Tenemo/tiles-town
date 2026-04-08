import { AppDispatch, createAppStore } from 'store';

import { getHighScores } from './gameActions';

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
});
