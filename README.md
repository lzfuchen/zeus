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
```