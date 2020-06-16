# zeus

从 0 到 1 使用 webpack 搭建一个 vue 开发环境

## 项目初始化

生成 package.json 文件

```javascript
npm init
```

## 安装 webpack

```javascript
// i 是 install 的缩写 -D 是 --save-dev 的缩写
npm i -D webpack webpack-cli
```

## 让程序跑起来

新建如下目录结构：

```
.
├── build
│   └── webpack.dev.js //webpack 测试脚本
└── src
    └── main.js // 程序入口文件

```

```javascript

//安装packages
npm i -D html-webpack-plugin webpack-dev-server

// html-webpack-plugin： 生成一个 HTML5 文件，其中包括使用 script 标签的 body 中的所有 webpack 包
// webpack-dev-server： 相当于一个http服务。可以快速开发应用程序

// webpack.dev.js 内容：
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, "../"),
  entry: "./src/main.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [new HtmlWebpackPlugin()],
  devtool: "cheap-module-eval-source-map",
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, "../dist"),
    compress: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    quiet: true,
  },
};
```

```javascript
//main.js 内容：
console.log("让程序跑起来");
```

```javascript
//在 package.json 文件下增加 scripts 命令
"dev": "webpack-dev-server --config ./build/webpack.dev.js",

//执行命令程序就可以跑起来了
npm run dev
```

## babel

上面的配置虽然可以让程序跑起来，但遇到不支持 es6 语法的浏览器还是会有问题，为了开心的使用 es6 语法，我们需要配置 babel

安装 packages

```javascript
//es6 转 es5 提供 polyfill
npm i -D @babel/core @babel/cli @babel/preset-env
npm i -S core-js@3
//注入helpers方法，节省代码大小
npm i -D @babel/plugin-transform-runtime
npm i -S @babel/runtime
```

创建 .browserslistrc 文件 内容如下（可以根据项目需要修改）：

```javascript
ie 10
edge 17
chrome 44
opera 12
firefox 60
safari 7
```

创建 .babelrc 文件 内容如下：

```javascript
{
  "presets": [
    [
      "@babel/env",
      {
        "modules": false,
        "useBuiltIns": "usage",
        "corejs": "3"
      }
    ]
  ],
  "plugins": [
    [
      "@babel/transform-runtime",{
        "helpers": true,
        "regenerator": false,
        "useESModules": true
      }
    ]
  ]
}
```

webpack.dev.js 配置 babel-loader

```javascript
//安装
npm install -D babel-loader
//webpack.dev.js 增加 module，配置 rules
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
        include: path.resolve(__dirname, '../src'),
      }
    ]
  }
}
```

## vue

上面关于 babel 将 es6 转为 es5 已经配置好了，接下来我们配置 vue

```javascript
//安装packages
npm i -S vue
npm i -D vue-loader vue-template-compiler css-loader cache-loader
//cache-loader 可以缓存编译结果，提高编译性能
//配置 webpack.dev.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
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
  test: /\.css$/,
  use: [
    'vue-style-loader',
    'css-loader'
  ]
}
plugins: [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../public/index.html'),
    filename: 'index.html',
  }),
  new VueLoaderPlugin()
],
//vue 一般挂载到一个 id 为 app 的 div上面，我们在public文件下面，新建 index.html，然后修改 HtmlWebpackPlugin 通过模版生成一个html文件

// 到这里已经可以使用vue了，可以写个简单demo测试一下。
//创建App.vue 内容如下：
<template>
  <div id="app">vue is running</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scoped>
#app{
  color: red;
}
</style>

//修改 main.js 内容如下：
import Vue from 'vue'
import App from './App.vue';

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

//执行npm run dev 看看是否运行正常
```

## css

配置 webpack 对 css 的处理，使用 css 预处理语言(sass)，以及 postcss 插件 autoprefixer。

```javascript
//安装packages
npm i -D sass-loader node-sass postcss-loader autoprefixer
//创建 postcss.config.js 文件内容如下：
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
// plugins：可以是个数组，也可以是个对象
module.exports = {
  plugins:{
    autoprefixer: {}
  }
}
// 修改 webpack.dev.js 内容如下
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
  test: /.scss$/,
  use: [
    'vue-style-loader',
    'css-loader',
    'postcss-loader',
    'sass-loader'
  ],
  exclude: /node_modules/,
}
```

## 静态资源

安装 url-loader file-loader

```javascript
npm i -D url-loader file-loader
//webpack 添加 module rules
{
  test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 1024,
    esModule: false,
    fallback: {
      loader: require.resolve('file-loader'),
      options: {
        name: "img/[name].[hash:8].[ext]"
      }
    }
  }
}
```

## 配置 eslint

```javascript
//安装
npm install eslint --save-dev
//生成eslint配置文件
npx eslint --init
//eslint与 webpack集成
npm i -D eslint-loader babel-eslint
//修改webpack.dev.js
module.export = {
  module: {
    rules:[
      {
        test: /\.(vue|(j|t)sx?)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          extensions: [ '.js', '.jsx', '.vue' ],
          cache: true,
          emitWarning: true,
          emitError: false
        }
      },
    ]
  }
}
//修改.eslintrc.js 增加parse： ‘babel-eslint’
module.exports = {
    root: true,
    "env": {
        "es2020": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "parserOptions": {
        parser: "babel-eslint",
    },
    "plugins": [
        "vue"
    ],
    "rules": {

    }
};
```

## eslint 和 prettier 结合 格式化代码

安装

```javascript
npm i -D prettier eslint-plugin-prettier eslint-config-prettier

//新建.prettier.config.js
module.exports = {
  printWidth: 100, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, //一个tab代表几个空格数，默认为2
  semi: true, //语句末尾是否使用分号，默认为true
  singleQuote: false, //是否单引号而不是双引号，默认为false
  trailingComma: 'none', //是否产生尾随逗号， 默认es5
  bracketSpacing: true, //在对象文字中的括号之间打印空格
  arrowParens: 'always', // 在单独的箭头函数参数周围包括括号
  htmlWhitespaceSensitivity: 'ignore', // HTML文件的全局空格敏感度
  endOfLine: 'auto'
}

//修改.eslintrc.js
module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  plugins: ["vue", "prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};

```
