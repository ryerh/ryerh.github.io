---
title: 'Babel bug: cannot assign readonly property'
date: 2016-02-19 11:07:38 Z
categories:
- babel
layout: post
---

今天 Debug 了一天（哭了好几次），因为 Babel 转换的代码在安卓 4.0.x 怎么都跑不起来。
分享一个坑。

# 出现前提：

`.babelrc` 配置如下：

``` javascript
{
    presets: ['es2015', 'stage-2'],
    plugins: ['transform-runtime'],
    comments: false
}
```

# 出现问题的系统：

安卓 4.0.x

# 报错：

``` javascript
Type Error::Cannot assign readonly property '__esModule' of ...
```

# 原因：

Babel 会把 ES6 import & export 转换成 CommonJS 的 require & exports。

所以你会在 Babel 每个内部模块开头看到这句话：

``` javascript
Object.defineProperty(exports, "__esModule", {
  value: true
});
```

问题出现在几处不标准的模块上，用的是下面的写法：

``` javascript
exports.__esModule = true;
```

# 解决方法：

Babel 有个 loose mode，开启之后就好了。

# 参考链接：

* [stackoverflow](http://stackoverflow.com/questions/27519836/uncaught-typeerror-cannot-assign-to-read-only-property)
* [stackoverflow](http://stackoverflow.com/questions/33087009/reactjs-babeljs-webpack-fails-on-android-4-0-x)
* [babeljs.algolia.com](https://babeljs.algolia.com/docs/advanced/loose/)
