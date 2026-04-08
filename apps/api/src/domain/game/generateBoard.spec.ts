import { solveBoard } from '@tiles-town/testkit';
import type { GameAttributes } from '../../models/game.model';
import { checkMoves } from './checkMoves';
import { generateBoard } from './generateBoard';

const createGame = (
    seed: string,
    moves: string[],
    easyMode = false,
): GameAttributes => ({
    game_number: 1,
    game_id: 'game-id',
    game_size: 5,
    game_seed: seed,
    game_easyMode: easyMode,
    game_isWon: false,
    game_isSeedCustom: false,
    game_start_time: new Date('2026-04-08T00:00:00.000Z'),
    game_moves: moves.join(','),
});

describe('generateBoard', () => {
    it('returns the same board for the same seed and mode', () => {
        const firstBoard = generateBoard(5, 'stable-seed');
        const secondBoard = generateBoard(5, 'stable-seed');

        expect(firstBoard).toEqual(secondBoard);
    });

    it('keeps board metadata aligned with the requested seed and size', () => {
        const board = generateBoard(6, 'metadata-seed', true);

        expect(board.size).toBe(6);
        expect(board.seed).toBe('metadata-seed');
        expect(board.tiles).toHaveLength(6);
        expect(board.tiles.every((row) => row.length === 6)).toBe(true);
        expect(
            board.tiles
                .flat()
                .every((tile) => tile === 0 || tile === 1 || tile === 2),
        ).toBe(true);
    });

    it('creates hard-mode boards that still have a valid solution', () => {
        const board = generateBoard(5, 'solvable-seed');
        const winningMoves = solveBoard(board.tiles);

        expect(winningMoves.length).toBeGreaterThan(0);
        expect(checkMoves(createGame('solvable-seed', winningMoves))).toBe(
            true,
        );
    });

    it('derives different easy and hard boards from the same seed', () => {
        const easyBoard = generateBoard(5, 'mode-seed', true);
        const hardBoard = generateBoard(5, 'mode-seed', false);

        expect(easyBoard.tiles).not.toEqual(hardBoard.tiles);
        expect(
            checkMoves(createGame('mode-seed', solveBoard(hardBoard.tiles))),
        ).toBe(true);
        expect(
            checkMoves(
                createGame('mode-seed', solveBoard(easyBoard.tiles), true),
            ),
        ).toBe(true);
    });
});
