const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = {
  mode: "development",
  cache: true,
  context: path.resolve(__dirname, "../"),
  entry: "./src/main.js",
  output: {
    filename: "[name].js",
    chunkFilename: "js/[name].js",
    path: path.resolve(__dirname, "../dist")
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src")
    },
    extensions: [".js", ".vue", ".json"],
    modules: [path.resolve(__dirname, "../node_modules")]
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/, // 忽略大型的 library 可以提高构建性能
    rules: [
      {
        test: /\.vue$/,
        use: [
          "cache-loader",
          {
            loader: "vue-loader",
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
        exclude: /node_modules/,
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader", "postcss-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "postcss-loader", "sass-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 1024,
          esModule: false,
          fallback: {
            loader: require.resolve("file-loader"),
            options: {
              name: "img/[name].[hash:8].[ext]"
            }
          }
        }
      },
      {
        test: /\.(svg)(\?.*)?$/,
        loader: "file-loader",
        options: {
          name: "img/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 1024,
          esModule: false,
          fallback: {
            loader: require.resolve("file-loader"),
            options: {
              name: "media/[name].[hash:8].[ext]"
            }
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: "url-loader",
        options: {
          limit: 1024,
          esModule: false,
          fallback: {
            loader: require.resolve("file-loader"),
            options: {
              name: "fonts/[name].[hash:8].[ext]"
            }
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "")
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`App running at: http://localhost:8080`]
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      filename: "index.html"
    }),
    new VueLoaderPlugin()
  ],
  //node选项可以防止node包，还有 setImmediate 的 profill注入到代码中
  node: {
    setImmediate: false,
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  devtool: "cheap-module-eval-source-map",
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
  }
};
