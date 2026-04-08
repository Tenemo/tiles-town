import { Component, ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import 'normalize.css';

import styles from './app.module.scss';

import Game from 'components/Game';
import Header from 'components/Header';
import NotFound from 'components/NotFound';

type State = {
    hasError: boolean;
    error: Error | string | null;
    errorInformation?: { componentStack: string } | null;
};

export class App extends Component {
    static getDerivedStateFromError = (): { hasError: boolean } => ({
        hasError: true,
    });

    readonly state: State = { hasError: false, error: null };

    componentDidCatch(
        error: Error | null,
        errorInformation: { componentStack: string },
    ): void {
        console.error(errorInformation.componentStack, error);
        this.setState({ error, errorInformation });
    }

    render(): ReactElement {
        const { hasError, error, errorInformation } = this.state;
        return (
            <main className={styles.app}>
                <Helmet>
                    <title>tiles.town</title>
                </Helmet>
                {hasError ? (
                    <div>
                        The application has crashed due to a rendering error.{' '}
                        <div className={styles.errorInfo}>
                            {JSON.stringify(error, null, 4)}
                            {JSON.stringify(errorInformation, null, 4)}
                        </div>
                    </div>
                ) : (
                    <>
                        <Header />
                        <Routes>
                            <Route element={<Game />} path="/" />
                            <Route element={<NotFound />} path="*" />
                        </Routes>
                    </>
                )}
            </main>
        );
    }
}
export default App;
