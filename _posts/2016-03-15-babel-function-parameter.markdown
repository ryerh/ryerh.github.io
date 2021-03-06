---
title: Babel 参数默认值转换 bug
date: 2016-03-15 15:08:26 +08:00
categories:
- javascript
layout: post
---

`.babelrc` 参数

``` javascript
{
    presets: ['es2015', 'es2015-loose', 'stage-2'],
    plugins: ['transform-runtime'],
    comments: false
}
```


input source code

``` javascript
let foo = 'outer';
function bar(func = x => foo) {
    let foo = 'inner';
    console.log(func()); // outer
}
bar();
```


Expected output:

``` javascript
'use strict';

var foo = 'outer';
var f = function(x) { return foo; };
function bar() {
    var func = arguments.length <= 0 || arguments[0] === undefined ? f : arguments[0];

    var foo = 'inner';
    console.log(func()); // I should get 'outer' here
}
bar();
```


Actual output:

``` javascript
'use strict';

var foo = 'outer';
function bar() {
    var func = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return foo;
    } : arguments[0];

    var foo = 'inner';
    console.log(func()); // however, I got an 'inner'
}
bar();
```

我提交的 bug report

[The scope of function parameter's default values is wrong.](https://phabricator.babeljs.io/T7204)
