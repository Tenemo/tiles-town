import { setTheme } from './appActions';
import { appReducer, initialAppState } from './appReducer';

describe('appReducer', () => {
    const previousState = initialAppState;
    describe(`theme`, () => {
        it('should change on the toggle theme action', () => {
            expect(appReducer(previousState, setTheme('light'))).toEqual({
                ...previousState,
                theme: 'light',
            });
        });
    });
});
