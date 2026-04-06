const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type Position = {
    row: number;
    column: number;
};

const isPlayable = (tile: number): boolean => tile === 0 || tile === 1;

const intToLetter = (numberInput: number): string => {
    const base = ALPHABET.length;
    const digits = [];
    let leftover = numberInput + 1;

    do {
        leftover -= 1;
        const value = leftover % base;
        digits.push(value);
        leftover = Math.floor(leftover / base);
    } while (leftover > 0);

    return digits
        .reverse()
        .map((digit) => ALPHABET[digit])
        .join('');
};

const affects = (move: Position, target: Position): boolean =>
    Math.abs(move.row - target.row) + Math.abs(move.column - target.column) <=
    1;

const toMoveNotation = ({ row, column }: Position, size: number): string =>
    `${intToLetter(column)}${size - row}`;

export const solveBoard = (board: number[][]): string[] => {
    const playableTiles: Position[] = [];

    board.forEach((row, rowIndex) => {
        row.forEach((tile, columnIndex) => {
            if (isPlayable(tile)) {
                playableTiles.push({
                    row: rowIndex,
                    column: columnIndex,
                });
            }
        });
    });

    const size = playableTiles.length;
    const matrix = playableTiles.map((target) => {
        const coefficients: number[] = playableTiles.map((move) =>
            affects(move, target) ? 1 : 0,
        );
        coefficients.push(board[target.row][target.column] % 2);
        return coefficients;
    });

    let pivotRow = 0;
    const pivots: number[] = [];

    for (let column = 0; column < size && pivotRow < size; column += 1) {
        let candidate = pivotRow;

        while (candidate < size && matrix[candidate][column] === 0) {
            candidate += 1;
        }

        if (candidate === size) {
            continue;
        }

        if (candidate !== pivotRow) {
            [matrix[pivotRow], matrix[candidate]] = [
                matrix[candidate],
                matrix[pivotRow],
            ];
        }

        for (let row = 0; row < size; row += 1) {
            if (row === pivotRow || matrix[row][column] === 0) {
                continue;
            }

            for (let index = column; index <= size; index += 1) {
                matrix[row][index] ^= matrix[pivotRow][index];
            }
        }

        pivots[pivotRow] = column;
        pivotRow += 1;
    }

    for (let row = 0; row < size; row += 1) {
        const hasCoefficients = matrix[row]
            .slice(0, size)
            .some((value) => value !== 0);

        if (!hasCoefficients && matrix[row][size] !== 0) {
            throw new Error('Board is not solvable.');
        }
    }

    const solution = new Array<number>(size).fill(0);

    for (let row = 0; row < pivots.length; row += 1) {
        solution[pivots[row]] = matrix[row][size];
    }

    return playableTiles
        .filter((_position, index) => solution[index] === 1)
        .map((position) => toMoveNotation(position, board.length));
};
