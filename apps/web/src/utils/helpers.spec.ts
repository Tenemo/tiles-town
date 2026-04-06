import { intToLetter, letterToInt, updateBoard } from './helpers';

import { GameState } from 'store/game/gameTypes';

const createGameState = (board: number[][]): GameState => ({
    requestsCount: 0,
    board: board.map((row) => [...row]),
    receivedBoard: [],
    size: board.length,
    newSize: board.length,
    leftCount: board.flat().filter((tile) => tile === 1).length,
    playerName: '',
    gameId: 'test-game',
    moveCount: 0,
    moves: [],
    seed: '',
    easyMode: false,
    highScores: [],
    isDisabled: false,
    firstTime: false,
    previous: {
        size: null,
        seed: '',
        moveCount: null,
        time: null,
        score: null,
        gameId: '',
        easyMode: null,
        isSeedCustom: null,
        playerName: '',
        moves: [],
    },
});

describe('helpers', () => {
    describe(`letterToInt`, () => {
        it('return the corresponding number when given characters', () => {
            expect(letterToInt('AC')).toEqual(28);
            expect(letterToInt('AA')).toEqual(26);
            expect(letterToInt('A')).toEqual(0);
            expect(letterToInt('B')).toEqual(1);
            expect(letterToInt('Z')).toEqual(25);
            expect(letterToInt('ZZ')).toEqual(701);
        });
    });
    describe(`intToLetter`, () => {
        it('return the corresponding characters when given a number', () => {
            expect(intToLetter(28)).toEqual('AC');
            expect(intToLetter(26)).toEqual('AA');
            expect(intToLetter(0)).toEqual('A');
            expect(intToLetter(1)).toEqual('B');
            expect(intToLetter(25)).toEqual('Z');
            expect(intToLetter(701)).toEqual('ZZ');
        });
    });
    describe('updateBoard', () => {
        it('flips the selected tile and its orthogonal neighbours', () => {
            const game = createGameState([
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ]);

            const result = updateBoard(game, 'B2');

            expect(result.board).toEqual([
                [1, 0, 1],
                [0, 0, 0],
                [1, 0, 1],
            ]);
            expect(result.leftCount).toBe(4);
        });

        it('throws when the board contains an unsupported tile value', () => {
            const game = createGameState([
                [1, 9, 1],
                [1, 1, 1],
                [1, 1, 1],
            ]);

            expect(() => updateBoard(game, 'B2')).toThrow(
                'Unsupported tile value: 9',
            );
        });
    });
});
