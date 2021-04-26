import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export default {
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json']
    },
    devtool: 'cheap-module-source-map',
    entry: [
        'babel-polyfill',
        //'eventsource-polyfill', // necessary for hot reloading with IE
        'webpack-hot-middleware/client',
        'react', // Include this to enforce order
        'react-dom', // Include this to enforce order
        // 'webpack-hot-middleware/client?reload=true',
        path.resolve(__dirname, '../src/index.jsx')
    ],
    target: 'web',
    mode: 'development',
    output: {
        path: __dirname + '../dist', // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'src'),
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react',
            $: 'jquery',
            jQuery: 'jquery',
            Popper: 'popper.js/dist/umd/popper' // https://github.com/FezVrasta/bootstrap-material-design/issues/1296
        }),
        new HardSourceWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        //new BundleAnalyzerPlugin(),
        // new MiniCssExtractPlugin({
        //     filename: '[name].css',
        //     chunkFilename: '[id].css'
        // }),
        new HtmlWebpackPlugin({
            template: 'src/index.pug',
            title: 'Tiles Town',
            filename: 'index.html',
            inject: 'true',
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.pug$/,
                use: 'pug-loader'
            },
            {
                test: /(\.css|\.scss|\.sass)$/,
                use: [
                    //MiniCssExtractPlugin.loader,
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: false,
                            sourceMap: true
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')
                            ],
                            sourceMap: true
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [path.resolve(__dirname, 'src', 'scss')],
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|ico|mp4)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/font-woff'
                        }
                    }
                ]
            },
            {
                test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/octet-stream'
                        }
                    }
                ]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'image/svg+xml'
                        }
                    }
                ]
            }
        ]
    }
};