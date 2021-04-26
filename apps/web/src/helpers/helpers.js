import gameClientConfig from '../../config/gameClientConfig';

/**
 * Checks if moves are legal and end up in victory
 * @param {object} game
 * @param {string} move
 * @return {boolean}
 */
export function updateBoard(game, move) {
    let board = game.board;
    let size = game.size;
    let leftCount = game.leftCount;
    let tile;

    move = alphaToNum(move, size);
    if (board[move[1]][move[0]] != 1 && board[move[1]][move[0]] != 0) throw new Error('Illegal move!');
    tile = board[move[1]][move[0]];
    if (tile === 1) {
        leftCount--;
    }
    if (tile === 0) {
        leftCount++;
    }
    board[move[1]][move[0]] = flip(tile);

    // tile UP
    if (move[1] + 1 <= board.length - 1) {
        tile = board[move[1] + 1][move[0]];
        if (tile === 1) {
            leftCount--;
        }
        if (tile === 0) {
            leftCount++;
        }
        board[move[1] + 1][move[0]] = flip(tile);
    }

    // tile RIGHT
    if (move[0] + 1 <= board.length - 1) {
        tile = board[move[1]][move[0] + 1];
        if (tile === 1) {
            leftCount--;
        }
        if (tile === 0) {
            leftCount++;
        }
        board[move[1]][move[0] + 1] = flip(tile);
    }

    // tile DOWN
    if (move[1] - 1 >= 0) {
        tile = board[move[1] - 1][move[0]];
        if (tile === 1) {
            leftCount--;
        }
        if (tile === 0) {
            leftCount++;
        }
        board[move[1] - 1][move[0]] = flip(tile);
    }

    // tile LEFT
    if (move[0] - 1 >= 0) {
        tile = board[move[1]][move[0] - 1];
        if (tile === 1) {
            leftCount--;
        }
        if (tile === 0) {
            leftCount++;
        }
        board[move[1]][move[0] - 1] = flip(tile);
    }
    game.board = board;
    game.leftCount = leftCount;
    return game;
}

/**
 * Flips a single tile
 * @param {num} tile -tile
 * @return {num}
 */
function flip(tile) {
    try {
        if (tile === 2) {
            return 2;
        }
        if (tile === 1) {
            return 0;
        }
        if (tile === 0) {
            return 1;
        }
    } catch (err) { return; }
}

/**
 * Converts numeric notation to alphanumeric
 * @param {array} moveArray -single move in numeric notation
 * @param {number} size -board size
 * @param {type} type -tile type
 * @return {string}
 */
export function numToAlpha(moveArray, size, type) {
    let result = '';
    if (type === 3) {
        result = moveArray[0] + size - (moveArray[0] * 2);
    }
    if (type === 4) {
        result = intToLetter(moveArray[0]);
    } else {
        moveArray[1] = intToLetter(moveArray[1]);
        moveArray[0] = moveArray[0] + size - (moveArray[0] * 2);
        result = moveArray[1] + moveArray[0];
    }
    return result;
}

/**
 * Converts alphanumeric notation to numerical
 * @param {string} move -single move in alphanumeric notation
 * @param {number} size -board size
 * @return {string}
 */
export function alphaToNum(move, size) {
    // extract integer from the end of the string to row
    let row = (move.match(/\d+$/) || []).pop();
    // remove row from the string
    let column = move.replace(/\d+$/, '');
    column = letterToInt(column);
    row = size - row;
    move = [column, row];
    return move;
}

/**
 * Converts numbers to corresponding alphabet letters, eg. 25 -> Z, 0 -> A
 * @param {number} numberInput -numberInput
 * @return {string}
 */
function intToLetter(numberInput) {
    const alphabet = gameClientConfig.alphabet;
    const base = alphabet.length;

    let digits = [];
    let chars = [];

    do {
        let v = numberInput % base;
        digits.push(v);
        numberInput = Math.floor(numberInput / base);
    } while (numberInput-- > 0);

    while (digits.length) {
        chars.push(alphabet[digits.pop()]);
    }

    return chars.join('');
}

/**
 * Converts alphabet letters to corresponding number, eg. AC -> 28, A -> 0
 * @param {string} stringInput -stringInput
 * @return {number}
 */
function letterToInt(stringInput) {
    const alphabet = gameClientConfig.alphabet;
    stringInput = stringInput.toUpperCase();
    let i, j, result = 0;

    for (i = 0, j = stringInput.length - 1; i < stringInput.length; i += 1, j -= 1) {
        result += Math.pow(alphabet.length, j) * (alphabet.indexOf(stringInput[i]) + 1);
    }

    return result - 1;
}

export default { numToAlpha, alphaToNum, updateBoard };