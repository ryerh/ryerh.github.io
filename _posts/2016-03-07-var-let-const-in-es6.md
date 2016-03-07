---
layout: post
title:  "关于 ES6 var, let, const 的思考"
date:   2016-03-07 11:17:23 +0800
categories: javascript
---

在 ES6 中，有三种方式声明变量：

{% highlight javascript %}
    1. var   foo = 'foo'
    2. let   bar = 'bar'
    3. const baz = 'baz'
{% endhighlight %}

我平时的最佳实践是：

    尽可能用 const，只有变量需要被重新赋值才使用 let，绝不用 var。

**为什么我会采用上述的最佳实践：**

变量值的修改所带来的副作用十分难以捕捉，
代码严重依赖变量的状态变化。

`const` 让我专注于状态的转移，
这样变量值的每一个状态都是可以捕捉到的，
这在代码调试期间非常有益，
对代码逻辑的理解也更加清晰。

让数据的状态像流水一样向前推进，每一步都留下痕迹，
而非捏像造一块橡皮泥一样不停地让数据产生变化，
这是学习函数式编程所粗略领略的一点益处。

**var 的语义：**

1. 声明一个变量
2. 变量可以被重复声明
3. 变量可以被赋值多次

**let 的语义：**

1. 声明一个只有块级作用域的变量
2. 不可被重复声明
3. 可以被赋值多次

**const 的语义：**

1. 声明一个只有块级作用域的变量
2. 不可被重复声明
3. 不可被重复赋值(重复赋值报不报错取决于是否开启 `'use strict'`，但值永远等于第一次赋的值)
4. 声明时必须初始化

**演示**

{% highlight javascript %}
    // var
    var foo;
    var foo; // ok
    foo = 1;
    foo = 2; // ok

    // let
    let bar;
    let bar; // bad
    bar = 1;
    bar = 2; // bad
    (() => {
        let bar; // ok
    })();

    // const
    const baz; // bad
    const baz = 1;
    baz = 2; // ok
    console.log(baz); // >> 1
    (() => {
        const baz = 3; // ok
    })();
{% endhighlight %}

参考链接：

[JavaScript ES6+: var, let, or const?](https://medium.com/javascript-scene/javascript-es6-var-let-or-const-ba58b8dcde75#.p0xo6usca)
