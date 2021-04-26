import browserSync from 'browser-sync';
// Required for react-router browserHistory
// see https://github.com/BrowserSync/browser-sync/issues/204#issuecomment-102623643
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.dev';

const bundler = webpack(config);

// Run Browsersync and use middleware for Hot Module Replacement
browserSync({
    port: 3000,
    logLevel: 'silent',
    ui: {
        port: 3001
    },
    open: false,
    cors: true,
    server: {
        baseDir: 'src',

        middleware: [
            historyApiFallback(),

            webpackDevMiddleware(bundler, {
                // Dev middleware can't access config, so we provide publicPath
                publicPath: config.output.publicPath,

                // These settings suppress noisy webpack output so only errors are displayed to the console.
                noInfo: true,
                // quiet: false,
                stats: {
                    hash: false,
                    version: false,
                    timings: false,
                    assets: false,
                    chunks: false,
                    modules: false,
                    reasons: false,
                    children: false,
                    source: false,
                    errors: true,
                    errorDetails: false,
                    warnings: false,
                    publicPath: false
                }
                // stats: 'none'

                // for other settings see
                // https://webpack.js.org/guides/development/#using-webpack-dev-middleware
            }),

            // bundler should be the same as above
            webpackHotMiddleware(bundler)
        ]
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
        'src/*.pug'
    ]
});
