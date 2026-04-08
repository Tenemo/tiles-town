import { randomBytes } from 'node:crypto';
import seedrandom from 'seedrandom';
import { applyMove, createBoard, isPlayableTile } from '@tiles-town/game-core';

interface GeneratedBoard {
    size: number;
    tiles: number[][];
    blankCount?: number;
    seed: string;
}

const generateCross = (
    board: GeneratedBoard,
    y: number,
    x: number,
): GeneratedBoard => {
    if (!board.blankCount) {
        throw new Error('Missing blankCount.');
    }

    board.tiles[y][x] = 1;
    board.blankCount -= 1;

    if (y - 1 > -1) {
        if (board.tiles[y - 1][x] === -1) {
            board.blankCount -= 1;
        }
        board.tiles[y - 1][x] = 1;
    }

    if (x - 1 > -1) {
        if (board.tiles[y][x - 1] === -1) {
            board.blankCount -= 1;
        }
        board.tiles[y][x - 1] = 1;
    }

    if (y + 1 < board.size) {
        if (board.tiles[y + 1][x] === -1) {
            board.blankCount -= 1;
        }
        board.tiles[y + 1][x] = 1;
    }

    if (x + 1 < board.size) {
        if (board.tiles[y][x + 1] === -1) {
            board.blankCount -= 1;
        }
        board.tiles[y][x + 1] = 1;
    }

    for (let index = -1; index < 2; index += 2) {
        if (
            y + index > -1 &&
            y + index < board.size &&
            x + index > -1 &&
            x + index < board.size &&
            board.tiles[y + index][x + index] === -1
        ) {
            board.tiles[y + index][x + index] = 2;
            board.blankCount -= 1;
        }

        if (
            y - index > -1 &&
            y - index < board.size &&
            x + index > -1 &&
            x + index < board.size &&
            board.tiles[y - index][x + index] === -1
        ) {
            board.tiles[y - index][x + index] = 2;
            board.blankCount -= 1;
        }
    }

    for (let index = -2; index < 3; index += 4) {
        if (
            x + index > -1 &&
            x + index < board.size &&
            board.tiles[y][x + index] === -1
        ) {
            board.tiles[y][x + index] = 2;
            board.blankCount -= 1;
        }

        if (
            y + index > -1 &&
            y + index < board.size &&
            board.tiles[y + index][x] === -1
        ) {
            board.tiles[y + index][x] = 2;
            board.blankCount -= 1;
        }
    }

    return board;
};

const nextStep = (board: GeneratedBoard, rng: () => number): GeneratedBoard => {
    if (!board.blankCount) {
        throw new Error('Missing blankCount.');
    }

    const targetBlankTile = Math.floor(rng() * board.blankCount) + 1;
    let y = 0;
    let x = 0;
    let seenBlankTiles = 0;

    if (targetBlankTile !== 1 || board.tiles[0][0] !== -1) {
        do {
            if (board.tiles[y][x] === -1) {
                seenBlankTiles += 1;
            }

            if (seenBlankTiles === targetBlankTile) {
                board = generateCross(board, y, x);
            }

            if (x === board.size - 1) {
                x = 0;
                y += 1;
            } else {
                x += 1;
            }
        } while (seenBlankTiles < targetBlankTile);
    } else {
        board = generateCross(board, y, x);
    }

    return board;
};

const hardMode = (board: GeneratedBoard, rng: () => number): GeneratedBoard => {
    const moveCount = board.size * board.size * 2;

    for (let index = 0; index < moveCount; index += 1) {
        const randomY = Math.floor(rng() * board.size);
        const randomX = Math.floor(rng() * board.size);
        const move: [number, number] = [randomY, randomX];

        if (isPlayableTile(board.tiles[move[1]][move[0]])) {
            applyMove(board.tiles, move);
        }
    }

    return board;
};

export const generateBoard = (
    size: number,
    seed?: string,
    easyMode = false,
): GeneratedBoard => {
    const resolvedSeed = seed ?? randomBytes(16).toString('hex');

    let board: GeneratedBoard = {
        size,
        tiles: createBoard(size, -1),
        blankCount: size * size,
        seed: resolvedSeed,
    };

    const rng = seedrandom(resolvedSeed);

    while (board.blankCount) {
        board = nextStep(board, rng);
    }

    if (!easyMode) {
        board = hardMode(board, rng);
    }

    delete board.blankCount;

    return board;
};
