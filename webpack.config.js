const path = require('path');
const webpack = require('webpack');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, { mode }) => ({
    devtool: 'source-map',
    entry: './src/client/client.js',
    output: {
        path: path.join(__dirname, '/static/dist'),
        filename: 'client-bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: [ 'babel-loader'/* , 'eslint-loader' */ ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                            // modules: true,
                            // localIdentName: '[name]__[local]--[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                postcssPresetEnv({
                                    stage: 0,
                                    browsers: 'last 2 years',
                                    autoprefixer: true
                                }),
                                postcssNested()
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: {
                    loader: 'svg-url-loader'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT: mode === 'development',
            IS_PRODUCTION: mode === 'production'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.json' ],
        alias: {
            src: path.resolve(__dirname, 'src')
        }
    }
});
