import type { GameAttributes } from '../../models/game.model';
import { calculateScore } from './score';

const createGame = (
    overrides: Partial<GameAttributes> = {},
): GameAttributes => ({
    game_number: 1,
    game_id: 'game-id',
    game_size: 4,
    game_seed: 'score-seed',
    game_easyMode: false,
    game_isWon: true,
    game_isSeedCustom: false,
    game_move_count: 4,
    game_start_time: new Date('2026-04-08T00:00:00.000Z'),
    game_end_time: new Date('2026-04-08T00:00:04.000Z'),
    ...overrides,
});

describe('calculateScore', () => {
    it('returns a deterministic score for a valid standard game', () => {
        expect(calculateScore(createGame())).toBe(110);
    });

    it('drops out of scoring for custom, easy, and undersized games', () => {
        expect(
            calculateScore(createGame({ game_isSeedCustom: true })),
        ).toBeNull();
        expect(calculateScore(createGame({ game_easyMode: true }))).toBeNull();
        expect(calculateScore(createGame({ game_size: 3 }))).toBeNull();
    });

    it('rewards faster and shorter solutions', () => {
        const fasterScore = calculateScore(
            createGame({
                game_move_count: 4,
                game_end_time: new Date('2026-04-08T00:00:04.000Z'),
            }),
        );
        const slowerScore = calculateScore(
            createGame({
                game_move_count: 9,
                game_end_time: new Date('2026-04-08T00:00:09.000Z'),
            }),
        );

        expect(fasterScore).toBeGreaterThan(slowerScore!);
    });

    it('throws when required completion data is missing', () => {
        expect(() =>
            calculateScore(createGame({ game_move_count: undefined })),
        ).toThrow('Missing game data. Cannot calculate score.');
        expect(() =>
            calculateScore(createGame({ game_end_time: undefined })),
        ).toThrow('Missing game data. Cannot calculate score.');
    });
});
