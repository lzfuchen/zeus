# zeus
从0到1使用webpack搭建一个vue开发环境

## 项目初始化

创建package.json 文件
```javascript
npm init 
```

## 安装webpack
```javascript
npm i -D webpack webpack-cli
```

### 让程序先跑起来
创建src文件夹，在下面新建main.js做为程序的入口文件。内容如下：
```javascript
console.log('让程序跑起来')
```

创建build文件夹，在下面创建webpack.dev.js做为测试环境webpack配置文件。内容如下：
```javascript
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
```
上面配置用到了两个插件：
```javascript
//安装插件
//html-webpack-plugin 生成一个h5文件
//webpack-dev-server 提供一个http服务
npm i -D html-webpack-plugin webpack-dev-server

//package.json 文件下增加scripts命令
"dev": "webpack-dev-server --config ./build/webpack.dev.js",

//执行命令程序就可以跑起来了
npm run dev
```

## babel

上面的配置虽然可以让程序跑起来，但遇到不支持es6语法的浏览器还是会有问题，为了开心的使用es6语法，我们需要配置babel

安装packages
```javascript
//es6 转 es5 提供polyfill
npm install --save-dev @babel/core @babel/cli @babel/preset-env
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
```

## vue

上面关于babel将es6转为es5已经配置好了，接下来我们配置vue
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

配置webpack对css的处理，使用css预处理语言(sass)，以及postcss插件autoprefixer。
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

安装url-loader file-loader
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

## 配置eslint

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
```
