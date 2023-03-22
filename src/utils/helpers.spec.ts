import { letterToInt, intToLetter } from './helpers';

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
});
