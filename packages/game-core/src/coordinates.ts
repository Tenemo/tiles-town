export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' as const;

export type MoveCoordinates = [column: number, row: number];

export const intToLetter = (numberInput: number): string => {
    const base = ALPHABET.length;
    const digits: number[] = [];
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

export const parseMoveCoordinates = (
    move: string,
    size: number,
): MoveCoordinates => {
    const rowText = move.match(/\d+$/)?.[0];
    const columnText = move.replace(/\d+$/, '');

    return [letterToInt(columnText), size - Number.parseInt(rowText ?? '', 10)];
};

export const formatMoveCoordinates = (
    [column, row]: MoveCoordinates,
    size: number,
): string => `${intToLetter(column)}${size - row}`;

export const isMoveWithinBoard = (move: string, size: number): boolean => {
    const [column, row] = parseMoveCoordinates(move, size);

    return (
        Number.isInteger(column) &&
        Number.isInteger(row) &&
        column >= 0 &&
        column < size &&
        row >= 0 &&
        row < size
    );
};
