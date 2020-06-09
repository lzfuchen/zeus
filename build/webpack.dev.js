const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '../'),
  entry: './src/main.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules:[
      {
        test: /\.vue$/,
        use: [
          'cache-loader',
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            } 
          }
        ],
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
    }),
    new VueLoaderPlugin()
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