import md5 from 'md5';
import seedrandom from 'seedrandom';
import { flip } from './checkMoves';

interface Board {
    size: number;
    tiles: number[][];
    blankCount?: number;
    seed: string;
}

const generateCross = (board: Board, y: number, x: number): Board => {
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

const nextStep = (board: Board, rng: () => number): Board => {
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

const hardMode = (board: Board, rng: () => number): Board => {
    const moveCount = board.size * board.size * 2;
    const move: [number, number] = [0, 0];

    for (let index = 0; index < moveCount; index += 1) {
        const randomY = Math.floor(rng() * board.size);
        const randomX = Math.floor(rng() * board.size);

        move[0] = randomY;
        move[1] = randomX;

        if (
            board.tiles[move[1]][move[0]] === 1 ||
            board.tiles[move[1]][move[0]] === 0
        ) {
            board.tiles[move[1]][move[0]] = flip(board.tiles[move[1]][move[0]]);

            if (move[1] + 1 <= board.tiles.length - 1) {
                board.tiles[move[1] + 1][move[0]] = flip(
                    board.tiles[move[1] + 1][move[0]],
                );
            }

            if (move[0] + 1 <= board.tiles.length - 1) {
                board.tiles[move[1]][move[0] + 1] = flip(
                    board.tiles[move[1]][move[0] + 1],
                );
            }

            if (move[1] - 1 >= 0) {
                board.tiles[move[1] - 1][move[0]] = flip(
                    board.tiles[move[1] - 1][move[0]],
                );
            }

            if (move[0] - 1 >= 0) {
                board.tiles[move[1]][move[0] - 1] = flip(
                    board.tiles[move[1]][move[0] - 1],
                );
            }
        }
    }

    return board;
};

export const generateBoard = (
    size: number,
    seed?: string,
    easyMode = false,
): Board => {
    const resolvedSeed =
        seed ?? md5(`${Date.now() + size + Math.random()}`).slice(0, -16);

    let board: Board = {
        size,
        tiles: [],
        blankCount: size * size,
        seed: resolvedSeed,
    };

    const rng = seedrandom(resolvedSeed);

    for (let row = 0; row < size; row += 1) {
        board.tiles[row] = [];
        for (let column = 0; column < size; column += 1) {
            board.tiles[row][column] = -1;
        }
    }

    while (board.blankCount) {
        board = nextStep(board, rng);
    }

    if (!easyMode) {
        board = hardMode(board, rng);
    }

    delete board.blankCount;

    return board;
};
