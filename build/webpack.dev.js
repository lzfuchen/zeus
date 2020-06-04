const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '../'),
  entry: './src/main.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    open: true,
    hot: true,
    contentBase: path.join(__dirname, "../dist"),
    compress: true,
    overlay: {
      warnings: true,
      errors: true
    },
    quiet: true
  },
}