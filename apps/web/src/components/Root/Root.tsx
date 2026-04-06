import { ReactElement, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';

import App from 'components/App';
import { store, history } from 'store';

import 'styles/global.scss';

export const Root = (): ReactElement => {
    useEffect(() => {
        // https://stackoverflow.com/questions/31402576/enable-focus-only-on-keyboard-use-or-tab-press
        const onMouseDown = (): void => {
            document.body.classList.add('using-mouse');
        };
        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        };

        document.body.addEventListener('mousedown', onMouseDown);
        document.body.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.removeEventListener('mousedown', onMouseDown);
            document.body.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <Provider store={store}>
            <HelmetProvider>
                <Router history={history}>
                    <App />
                </Router>
            </HelmetProvider>
        </Provider>
    );
};

export default Root;
