import {
    TileState,
    applyMove,
    cloneBoard,
    countActiveTiles,
    createBoard,
    flipTile,
    formatMoveCoordinates,
    intToLetter,
    isMoveWithinBoard,
    letterToInt,
    parseMoveCoordinates,
} from './index';

describe('game core helpers', () => {
    it('converts letters and numbers in both directions', () => {
        expect(intToLetter(0)).toBe('A');
        expect(intToLetter(25)).toBe('Z');
        expect(intToLetter(26)).toBe('AA');
        expect(letterToInt('A')).toBe(0);
        expect(letterToInt('ZZ')).toBe(701);
        expect(formatMoveCoordinates([1, 2], 4)).toBe('B2');
        expect(parseMoveCoordinates('B2', 4)).toEqual([1, 2]);
    });

    it('detects whether moves fit inside the current board', () => {
        expect(isMoveWithinBoard('A1', 4)).toBe(true);
        expect(isMoveWithinBoard('D4', 4)).toBe(true);
        expect(isMoveWithinBoard('E1', 4)).toBe(false);
        expect(isMoveWithinBoard('P16', 4)).toBe(false);
    });

    it('flips the selected tile and its orthogonal neighbours', () => {
        const board = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ];

        applyMove(board, [1, 1]);

        expect(board).toEqual([
            [1, 0, 1],
            [0, 0, 0],
            [1, 0, 1],
        ]);
    });

    it('handles corner moves and blocked cells safely', () => {
        const board = [
            [1, 1, 2],
            [1, 0, 1],
            [2, 1, 1],
        ];

        applyMove(board, [0, 0]);

        expect(board).toEqual([
            [0, 0, 2],
            [0, 0, 1],
            [2, 1, 1],
        ]);
        expect(() => applyMove(board, [2, 0])).toThrow('Illegal move!');
        expect(() => applyMove(board, [9, 9])).toThrow('Illegal move!');
    });

    it('counts active tiles and clones boards without sharing references', () => {
        const board = createBoard(2);
        board[0][0] = TileState.Active;
        board[1][1] = TileState.Blocked;

        const clonedBoard = cloneBoard(board);

        expect(countActiveTiles(board)).toBe(1);
        expect(flipTile(TileState.Active)).toBe(TileState.Flipped);
        expect(flipTile(TileState.Flipped)).toBe(TileState.Active);
        expect(flipTile(TileState.Blocked)).toBe(TileState.Blocked);

        clonedBoard[0][0] = TileState.Flipped;
        expect(board[0][0]).toBe(TileState.Active);
    });
});
