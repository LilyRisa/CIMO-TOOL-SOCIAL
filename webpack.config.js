const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const JS_DIR = path.resolve(__dirname, 'static/js');

const CSS_DIR = path.resolve(__dirname, 'static/scss');

const NODE_MODULE = path.resolve(__dirname, 'node_modules');




const entry = {
    main: [
        // JS_DIR + '/bundle.js',
        JS_DIR + '/tiktok.js',
        JS_DIR + '/facebook.js',
        JS_DIR + '/youtube.js',
        JS_DIR + '/video_editing.js',
        CSS_DIR + '/bundle.scss',
    ]
};

const output = {
    path: path.resolve(__dirname),
    filename: 'static/compile/[name].min.js'
};

const rules = [
    {
        test: /\.js$/,
        include: NODE_MODULE,
        exclude: /(node_modules)/,
        // Loaders enable us to bundle the static assets.
        // loader: 'babel-loader', // Allows for transpiling JS files using babel & webpack.
        use: [
            {
                loader: 'file-loader',
                options: { outputPath: 'static/compile' , name: '[name].min.js'}
            },
            "babel-loader", // 1. Turns js into js
        ],
    },
    {
        test: /\.scss$/,
        exclude: NODE_MODULE,
        include: path.resolve(__dirname),
        use: [
            {
                loader: 'file-loader',
                options: { outputPath: 'static/compile' , name: '[name].min.css'}
            },
            // 'style-loader',
            // "css-loader",
            "sass-loader", // 1. Turns sass into css
            // "css-loader",
            // 'style-loader',
        ],
        
    }
];
module.exports = () => ({
    entry: entry,
    output: output,
    devtool: false, // Don't output any .map source files, otherwise 'source-map'.
    module: {
        rules: rules,
    },
    optimization : {
        minimizer: [
            // new CssMinimizerPlugin(),
            new TerserPlugin(),
        ],
        minimize: true,
    },
    plugins: [
        // new MiniCssExtractPlugin(),
    ],
    
});