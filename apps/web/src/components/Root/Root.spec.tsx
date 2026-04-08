import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ReactElement } from 'react';

import { createAppStore } from 'store';
import { setTheme } from 'store/app/appActions';

import { RootContent } from './Root';

vi.mock('components/App', () => ({
    default: (): ReactElement => <div>App shell</div>,
}));

describe('RootContent', () => {
    afterEach(() => {
        delete document.documentElement.dataset.theme;
        document.body.classList.remove('using-mouse');
    });

    it('writes the current theme to the root data attribute', async () => {
        const testStore = createAppStore();

        render(
            <Provider store={testStore}>
                <RootContent />
            </Provider>,
        );

        expect(screen.getByText('App shell')).toBeInTheDocument();

        await waitFor(() => {
            expect(document.documentElement.dataset.theme).toBe('dark');
        });

        act(() => {
            testStore.dispatch(setTheme('light'));
        });

        await waitFor(() => {
            expect(document.documentElement.dataset.theme).toBe('light');
        });
    });
});
