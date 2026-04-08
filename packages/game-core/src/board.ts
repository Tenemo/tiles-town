import type { MoveCoordinates } from './coordinates';

export const TileState = {
    Flipped: 0,
    Active: 1,
    Blocked: 2,
} as const;
export type TileState = (typeof TileState)[keyof typeof TileState];

export type Board = number[][];

export const createBoard = (
    size: number,
    fillValue: number = TileState.Flipped,
): Board =>
    Array.from({ length: size }, () =>
        Array.from({ length: size }, () => fillValue),
    );

export const cloneBoard = (board: Board): Board => board.map((row) => [...row]);

export const isPlayableTile = (tile: number): boolean =>
    tile === TileState.Flipped || tile === TileState.Active;

export const flipTile = (tile: number): number => {
    if (tile === TileState.Blocked) {
        return TileState.Blocked;
    }

    if (tile === TileState.Active) {
        return TileState.Flipped;
    }

    if (tile === TileState.Flipped) {
        return TileState.Active;
    }

    throw new Error(`Unsupported tile value: ${tile.toString()}`);
};

const isWithinBoard = (board: Board, [column, row]: MoveCoordinates): boolean =>
    row >= 0 && row < board.length && column >= 0 && column < board[row].length;

export const applyMove = (
    board: Board,
    [column, row]: MoveCoordinates,
): void => {
    if (!isWithinBoard(board, [column, row])) {
        throw new Error('Illegal move!');
    }

    if (!isPlayableTile(board[row][column])) {
        throw new Error('Illegal move!');
    }

    const positions: MoveCoordinates[] = [
        [column, row],
        [column, row + 1],
        [column + 1, row],
        [column, row - 1],
        [column - 1, row],
    ];

    for (const position of positions) {
        if (!isWithinBoard(board, position)) {
            continue;
        }

        const [nextColumn, nextRow] = position;
        board[nextRow][nextColumn] = flipTile(board[nextRow][nextColumn]);
    }
};

export const countActiveTiles = (board: Board): number =>
    board.flat().filter((tile) => tile === TileState.Active).length;
