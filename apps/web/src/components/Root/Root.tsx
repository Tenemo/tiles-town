import { ReactElement, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import App from 'components/App';
import { getAppTheme } from 'store/app/appSelectors';
import { store, useSelector } from 'store';

import 'styles/global.scss';
import 'react-toastify/dist/ReactToastify.css';

export const RootContent = (): ReactElement => {
    const appTheme = useSelector(getAppTheme);

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

    useEffect(() => {
        document.documentElement.dataset.theme = appTheme;
    }, [appTheme]);

    return (
        <HelmetProvider>
            <Router>
                <App />
                <ToastContainer theme={appTheme} />
            </Router>
        </HelmetProvider>
    );
};

export const Root = (): ReactElement => {
    return (
        <Provider store={store}>
            <RootContent />
        </Provider>
    );
};

export default Root;
