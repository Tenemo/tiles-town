//import 'babel-polyfill';
//import 'eventsource-polyfill';
require('../node_modules/es6-promise').polyfill();
require('fetch-everywhere');
import 'bootstrap/dist/js/bootstrap.min.js';
import './styles/themes.scss';
import { render } from 'react-dom';
import configureStore, { history } from './store/configureStore';
import { AppContainer } from 'react-hot-loader';
import Root from './components/Root';
import { getHighScores } from './actions/gameActions';
import { persistStore } from 'redux-persist';

const store = configureStore();
let persistor = persistStore(store);
store.dispatch(getHighScores());

// global trunc polyfill for IE11
Math.trunc = Math.trunc || function (x) {
    if (isNaN(x)) {
        return NaN;
    }
    if (x > 0) {
        return Math.floor(x);
    }
    return Math.ceil(x);
};

render(
    (
        <AppContainer>
            <Root store={store} history={history} persistor={persistor} />
        </AppContainer>
    ),
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept('./components/Root', () => {
        const NewRoot = require('./components/Root').default;
        render(
            (
                <AppContainer>
                    <NewRoot store={store} history={history} persistor={persistor} />
                </AppContainer>
            ),
            document.getElementById('app')
        );
    });
}