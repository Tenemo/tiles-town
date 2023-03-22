import { GameState } from 'store/game/gameTypes';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' as const;

/**
 * Converts alphabet letters to corresponding number, eg. AC -> 28, A -> 0
 */
export const letterToInt = (input: string): number =>
    input
        .toUpperCase()
        .split('')
        .reverse()
        .reduce(
            (result, character, index) =>
                result +
                (ALPHABET.indexOf(character) + 1) * ALPHABET.length ** index,
            0,
        ) - 1;

/**
 * Converts numbers to corresponding alphabet letters, eg. 25 -> Z, 0 -> A, 0 -> A
 */
export const intToLetter = (numberInput: number): string => {
    const base = ALPHABET.length;
    const digits = [];
    let leftover = numberInput + 1;
    do {
        leftover -= 1;
        const v = leftover % base;
        digits.push(v);
        leftover = Math.floor(leftover / base);
    } while (leftover > 0);
    return digits
        .reverse()
        .map((digit) => ALPHABET[digit])
        .join('');
};

export const alphaToNum = (move: string, size: number): [number, number] => {
    // extract integer from the end of the string to row
    const row = parseInt((move.match(/\d+$/) || []).pop() as string, 10);
    // remove row from the string
    const columnLetter = move.replace(/\d+$/, '');
    const columnNumber = letterToInt(columnLetter);
    const rowNumber = size - row;
    const newMove: [number, number] = [columnNumber, rowNumber];
    return newMove;
};

/**
 * Converts numeric notation to alphanumeric
 */
export const numToAlpha = (
    coords: [number, number] | [number],
    size: number,
    type: number,
): string => {
    let result: string;
    if (type === 3) {
        result = (coords[0] + size - coords[0] * 2).toString();
    } else if (type === 4) {
        result = intToLetter(coords[0]);
    } else {
        const alphanumericCoords = [];
        alphanumericCoords[1] = coords[1] ? intToLetter(coords[1]) : '';
        alphanumericCoords[0] = coords[0] + size - coords[0] * 2;
        result = `${alphanumericCoords[1]}${alphanumericCoords[0]}`;
    }
    return result;
};

/**
 * Flips a single tile
 * @param {num} tile -tile
 * @return {num}
 */
const flip = (tile: number): number => {
    if (tile === 2) {
        return 2;
    }
    if (tile === 1) {
        return 0;
    }
    if (tile === 0) {
        return 1;
    }
    // eslint-disable-next-line no-console
    console.error('uh oh');
    return 999;
};

export const updateBoard = (game: GameState, move: string): GameState => {
    const { board } = game;
    const { size } = game;
    let leftCount = game.leftCount as number;
    let tile;

    const numericMove = alphaToNum(move, size);
    if (
        board[numericMove[1]][numericMove[0]] !== 1 &&
        board[numericMove[1]][numericMove[0]] !== 0
    )
        throw new Error('Illegal move!');
    tile = board[numericMove[1]][numericMove[0]];
    if (tile === 1) {
        leftCount -= 1;
    }
    if (tile === 0) {
        leftCount += 1;
    }
    board[numericMove[1]][numericMove[0]] = flip(tile);

    // tile UP
    if (numericMove[1] + 1 <= board.length - 1) {
        tile = board[numericMove[1] + 1][numericMove[0]];
        if (tile === 1) {
            leftCount -= 1;
        }
        if (tile === 0) {
            leftCount += 1;
        }
        board[numericMove[1] + 1][numericMove[0]] = flip(tile);
    }

    // tile RIGHT
    if (numericMove[0] + 1 <= board.length - 1) {
        tile = board[numericMove[1]][numericMove[0] + 1];
        if (tile === 1) {
            leftCount -= 1;
        }
        if (tile === 0) {
            leftCount += 1;
        }
        board[numericMove[1]][numericMove[0] + 1] = flip(tile);
    }

    // tile DOWN
    if (numericMove[1] - 1 >= 0) {
        tile = board[numericMove[1] - 1][numericMove[0]];
        if (tile === 1) {
            leftCount -= 1;
        }
        if (tile === 0) {
            leftCount += 1;
        }
        board[numericMove[1] - 1][numericMove[0]] = flip(tile);
    }

    // tile LEFT
    if (numericMove[0] - 1 >= 0) {
        tile = board[numericMove[1]][numericMove[0] - 1];
        if (tile === 1) {
            leftCount -= 1;
        }
        if (tile === 0) {
            leftCount += 1;
        }
        board[numericMove[1]][numericMove[0] - 1] = flip(tile);
    }
    return { ...game, board, leftCount };
};
