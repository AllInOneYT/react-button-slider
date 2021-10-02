const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config');

module.exports = merge(config, {
  mode: 'development',
  entry: {
    main: './src/App.tsx',
  },
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
  devServer: {
    open: true,
  },
});
