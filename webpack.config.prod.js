const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('./webpack.config');

module.exports = merge(config, {
  mode: 'production',
  entry: {
    main: './src/index.tsx',
  },
  output: {
    publicPath: path.resolve('lib'),
    filename: 'index.js',
    path: path.resolve('lib'),
    libraryTarget: 'commonjs2',
  },
  target: ['web', 'es5'],
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    },
  },
});
