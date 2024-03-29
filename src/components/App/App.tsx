import React, { Component, ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import 'normalize.css';

import 'fonts/RobotoMono-Regular.woff2';
import 'fonts/RobotoMono-Regular.woff';

import styles from './app.scss';

import Game from 'components/Game';
import Header from 'components/Header';
import NotFound from 'components/NotFound';
import { getAppTheme } from 'store/app/appSelectors';
import { RootState } from 'store/types';

type State = {
    hasError: boolean;
    error: Error | string | null;
    errorInformation?: { componentStack: string } | null;
};

type Props = {
    appTheme: string;
};

export class App extends Component<Props> {
    static getDerivedStateFromError = (): { hasError: boolean } => ({
        hasError: true,
    });

    readonly state: State = { hasError: false, error: null };

    componentDidCatch(
        error: Error | null,
        errorInformation: { componentStack: string },
    ): void {
        // eslint-disable-next-line no-console
        console.error(errorInformation.componentStack, error);
        this.setState({ error, errorInformation });
    }

    render(): ReactElement {
        const { hasError, error, errorInformation } = this.state;
        const { appTheme } = this.props;
        const classNames = `${styles.app} theme-${appTheme}`;
        return (
            <main className={classNames}>
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

const mapStateToProps = (state: RootState): { appTheme: string } => ({
    appTheme: getAppTheme(state),
});

export default connect(mapStateToProps)(App);
