import { GameAttributes } from '../../models/game.model';
import { convertMoves } from '../../utils/helpers';
import { generateBoard } from './generateBoard';

export const flip = (tile: number): number => {
    if (tile === 2) {
        return 2;
    }

    if (tile === 1) {
        return 0;
    }

    if (tile === 0) {
        return 1;
    }

    throw new Error(`Wrong tile value to flip: ${tile}`);
};

const applyMove = (board: number[][], [column, row]: number[]): void => {
    if (board[row][column] !== 1 && board[row][column] !== 0) {
        throw new Error('Illegal move!');
    }

    board[row][column] = flip(board[row][column]);

    if (row + 1 <= board.length - 1) {
        board[row + 1][column] = flip(board[row + 1][column]);
    }

    if (column + 1 <= board.length - 1) {
        board[row][column + 1] = flip(board[row][column + 1]);
    }

    if (row - 1 >= 0) {
        board[row - 1][column] = flip(board[row - 1][column]);
    }

    if (column - 1 >= 0) {
        board[row][column - 1] = flip(board[row][column - 1]);
    }
};

export const checkMoves = (game: GameAttributes): boolean => {
    const board = generateBoard(
        game.game_size,
        game.game_seed,
        game.game_easyMode,
    ).tiles;

    if (!game.game_moves) {
        return false;
    }

    const moves = convertMoves(game.game_moves.split(','), game.game_size);

    moves.forEach((move) => {
        applyMove(board, move);
    });

    return board.every((row) => !row.includes(1));
};
