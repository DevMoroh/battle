
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var autoprefixer = require('autoprefixer');
var precss = require('precss');

module.exports = {

    entry: {
        devServerClient:[
            'webpack-dev-server/client?http://localhost:8082',
            'webpack/hot/only-dev-server'
        ],
        babelPolyfill:'babel-polyfill',
        app:'./src/app.js'
    },
    output:{
        path:'./bundle',
        filename:'[name].bundle.js',
    },

    devtool: 'source-map',
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body'
        })
    ],

    module: {
        preLoaders: [ //добавили ESlint в preloaders
            {
                test: /\.js$/,
                loaders: ['eslint'],
                include: [
                    path.resolve(__dirname, "src"),
                ],
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src"),
                ],
                plugins: ['transform-runtime']
            },
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            },
            {
                test: /\.html$/,
                loader: 'html',
                query: {
                    minimize: false
                }
            }
        ],
        postcss: function () {
            return [autoprefixer, precss];
        }
    },

    devServer: {
        contentBase:'./src',
        host:'localhost',
        port:8082,
        hot:true,
        inline:true
    }
};