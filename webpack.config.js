const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = MiniCssExtractPlugin.loader;

const meta = {
    charset: 'UTF-8',
    viewport: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
};

const config = {
    entry: {
        carousel: './src/components/carousel/carousel.js',
        bsCarousel: './src/components/bs-carousel/bs-carousel.js',
        details: './src/assets/js/details.js',
        index: {
            import: './src/assets/js/index.js',
            dependOn: ['carousel', 'bsCarousel'],
        },
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            meta,
            inject: 'body',
            chunks: ['carousel', 'bsCarousel', 'index'],
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/details.html',
            meta,
            filename: 'pages/details.html',
            inject: 'body',
            chunks: ['details'],
        }),
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
};

module.exports = () => {
    config.mode = (isProduction) ? 'production' : 'development';

    return config;
};
