import { solveBoard } from '@tiles-town/testkit';
import { formatMoveCoordinates } from '@tiles-town/game-core';
import type { GameAttributes } from '../../models/game.model';
import { checkMoves, flip } from './checkMoves';
import { generateBoard } from './generateBoard';

const createGame = (
    overrides: Partial<GameAttributes> = {},
): GameAttributes => ({
    game_number: 1,
    game_id: 'game-id',
    game_size: 4,
    game_seed: 'seed-value',
    game_easyMode: false,
    game_isWon: false,
    game_isSeedCustom: false,
    game_start_time: new Date('2026-04-08T00:00:00.000Z'),
    game_moves: undefined,
    ...overrides,
});

describe('checkMoves', () => {
    it('flips playable tiles and rejects unsupported values', () => {
        expect(flip(0)).toBe(1);
        expect(flip(1)).toBe(0);
        expect(flip(2)).toBe(2);
        expect(() => flip(3)).toThrow('Unsupported tile value: 3');
    });

    it('accepts a generated winning solution for a deterministic board', () => {
        const board = generateBoard(4, 'winning-seed').tiles;
        const winningMoves = solveBoard(board);

        expect(
            checkMoves(
                createGame({
                    game_seed: 'winning-seed',
                    game_moves: winningMoves.join(','),
                }),
            ),
        ).toBe(true);
    });

    it('returns false when no moves are supplied', () => {
        expect(checkMoves(createGame())).toBe(false);
    });

    it('throws on moves targeting blocked tiles', () => {
        const board = generateBoard(4, 'blocked-seed', true).tiles;
        const blockedTile = board
            .flatMap((row, rowIndex) =>
                row.map((tile, columnIndex) => ({
                    tile,
                    rowIndex,
                    columnIndex,
                })),
            )
            .find(({ tile }) => tile === 2);

        expect(blockedTile).toBeDefined();

        const blockedMove = formatMoveCoordinates(
            [blockedTile!.columnIndex, blockedTile!.rowIndex],
            board.length,
        );

        expect(() =>
            checkMoves(
                createGame({
                    game_seed: 'blocked-seed',
                    game_easyMode: true,
                    game_moves: blockedMove,
                }),
            ),
        ).toThrow('Illegal move!');
    });
});
