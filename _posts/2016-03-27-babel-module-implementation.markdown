---
title: 分析 Babel 转换 ES6 module 的原理
date: 2016-03-27 15:04:18 +08:00
categories:
- javascript
layout: post
---

写这篇分析是为了追踪 Babel 的一处模块化转换 bug，暂时还没有理清头绪，所以写下此详细分析，等分析出结果再更新此文。

以下内容仅讨论 Babel 与 CMD 模块风格，当然 Babel 也可以使用 AMD 风格转换模块。

# 模块导出

``` javascript
export const InlineExport = { }
const NormalExport = { }
const RenameExport = { }
const DefaultExport = { }

export { NormalExport }
export { RenameExport as HasRenamed }
export default DefaultExport

// 转换后
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var InlineExport = exports.InlineExport = {};
var NormalExport = {};
var RenameExport = {};
var DefaultExport = {};

exports.NormalExport = NormalExport;
exports.HasRenamed = RenameExport;
exports.default = DefaultExport;
```

# 模块引入

``` javascript
import { NormalExport } from 'normal'
import { HasRenamed as RenameAgain } from 'rename'
import DefaultExport from 'default'
import * as All from 'all'

NormalExport()
RenameAgain()
DefaultExport()
All()

// 转换后
'use strict';

var _normal = require('normal');
var _rename = require('rename');

var _default = require('default');
var _default2 = _interopRequireDefault(_default);

var _all = require('all');
var all = _interopRequireWildcard(_all);

(0, _normal.NormalExport)();
(0, _rename.HasRenamed)();
(0, _default2.default)();
all.hello();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule
    ? obj
    : { default: obj };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}
```

# 代码非常易读，但是有两个疑问

1. 模块导出时通过 `Object.defineProperty` 定义的 `exports.__esModule` 有什么用？
2. 模块引入后执行时为什么使用逗号表达式？

要解开这两个疑惑，必须得理解 ES6 的模块化方案和 CommonJS 方案有什么区别与联系。

# 理解 ES6 module 和 CommonJS 的区别

**先说说 CommonJS 方案的特点：**

1. 所有要输出的对象统统挂载在 `module.exports` 上，然后暴露给外界
2. 通过 `require` 加载别的模块，`require` 的返回值就是模块暴露的对象
3. CommonJS 是一个**单对象**输出，**单对象**加载的模型

**再来看看 ES6 的模块化机制有什么特点：**

1. 可通过以下方式输出任何对模块内部的引用
    1. `export { A, B }`
    2. `export { A as a, B }`
    3. `export default A`
    4. `export const A = { }`
2. 通过以下方式加载模块中输出的任意引用
    1. `import A from './module'`
    2. `import * as A from './module'`
    3. `import { A, B } from './module'`
    4. `import { A as a, B } from './module'`
3. ES6 module 是一个**多对象**输出，**多对象**加载的模型

# 理解 ES6 module 和 CommonJS 的联系

目前的浏览器几乎都不支持 ES6 的模块机制，所以我们要用 Babel 把 ES6 的模块机制转换成 CommonJS 的形式，然后使用 Browserify 或者 Webpack 这样的打包工具把他们打包起来（本文结束的地方会给出一个 Browserify 打包后的代码示例，不熟悉的话看上去会比较凌乱）。

然后问题就来了，ES6 的模块机制和 CommonJS 机制差距甚大，所以 Babel 需要在借助 CommonJS 的实现基础上稍作修改，以达到符合 ES6 标准的目的。

于是 Babel 开始发挥奇技淫巧了 ~

# Babel 是怎么实现 ES6 模块的转换的？

本文刚开篇给出的两端代码就是 Babel 的转换方法，现在我来解释 Babel 是怎么做的。

Babel 依然通过 `exports` 对象来输出模块内的引用，但是增加了一个特殊的 `exports.default` 属性用来实现 ES6 的默认输出对象。并且依然通过 `require` 来实现模块的加载。

# 疑问一的答案

给模块的输出对象增加 `__esModule` 是为了将不符合 Babel 要求的 CommonJS 模块转换成符合要求的模块，这一点在 `require` 的时候体现出来。如果加载模块之后，发现加载的模块带着一个 `__esModule` 属性，Babel 就知道这个模块肯定是它转换过的，这样 Babel 就可以放心地从加载的模块中调用 `exports.default` 这个导出的对象，也就是 ES6 规定的默认导出对象，所以这个模块既符合 CommonJS 标准，又符合 Babel 对 ES6 模块化的需求。然而如果 `__esModule` 不存在，也没关系，Babel 在加载了一个检测不到 `__esModule` 的模块时，它就知道这个模块虽然符合 CommonJS 标准，但可能是一个第三方的模块，Babel 没有转换过它，如果以后直接调用 `exports.default` 是会出错的，所以现在就给它补上一个 `default` 属性，就干脆让 `default` 属性指向它自己就好了，这样以后就不会出错了。

# 疑问二的答案

这个逗号表达式是 JavaScript 的语言特性，具体含义是这样的：整个逗号表达式都会从左到右执行一遍，然后逗号表达式的值等于最后一个逗号之后的表达式的值。这跟 C/C++ 等其他 C 类语言是一样的。

但是这句话对 JavaScript 有个特殊含义，如果执行 `(0, foo.bar)()`，这个逗号表达式等价于执行 `foo.bar()`，但是执行时的上下文环境会被绑定到全局对象身上，所以实际上真正等价于执行 `foo.bar.call(GLOBAL_OBJECT)`。

# 前面提到的打包后的代码示例

``` javascript
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _lib = require('./lib.js');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (window && window.alert) {
    alert(_lib2.default);
} else {
    console.log(_lib2.default);
}

},{"./lib.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck2 = _interopRequireDefault(_classCallCheck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = 'hello, world';

},{"babel-runtime/helpers/classCallCheck":3}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}]},{},[1]);
```

# 参考链接

1. [Babel and CommonJS modules](http://www.2ality.com/2015/12/babel-commonjs.html)
