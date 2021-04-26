import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { hot } from 'react-hot-loader';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';

class Root extends Component {
    render() {
        const { store, history, persistor } = this.props;
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ConnectedRouter history={history}>
                        <App />
                    </ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    persistor: PropTypes.object.isRequired
};

export default hot(module)(Root);