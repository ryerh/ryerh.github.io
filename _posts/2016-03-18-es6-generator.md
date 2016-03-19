---
layout: post
title:  "为什么 generator 忽略第一次 next 调用的参数值呢？"
date:   2016-03-15 15:08:26 +0800
categories: javascript
---

# 前提

首先要理解几个基本概念。

1. 执行生成器不会执行生成器函数体的代码，只是获得一个遍历器
2. 一旦调用 `next`，函数体就开始执行，一旦遇到 `yield` 就返回执行结果，暂停执行
3. 第二次 `next` 的参数会作为第一次 `yield` 的结果传递给函数体，以此类推，所以第一次 `next` 调用的参数没用


# Part I -- 源码加注解

{% highlight javascript %}

// 获得一个遍历器对象
const runner = gen(3);

console.log( runner.next(4) ); // { value: 3, done: false }
console.log( runner.next(5) ); // { value: 5, done: false }
console.log( runner.next(6) ); // { value: 14, done: true }

// 定义生成器
function* gen(x) {
  /*
    第一次调用 next(4) 开始执行，
    但是参数 4 会被忽略掉，
    请继续往下看。
  */

  const y = yield x /*
    遇到 yield 立即暂停，
    所以第一次 next(4) 调用就结束了，
    参数 4 也就因此被忽略掉了，
    返回 { value: x, done: false }。

    等待下一次调用 next(5) 恢复执行，
    将参数 5 作为表达式 yield x 的结果赋值给 y 。
  */;

  const z = yield y /*
    遇到 yield 立即暂停，
    返回 { value: y, done: false }

    等待下一次调用 next(6) 恢复执行，
    将参数 6 作为表达式 yield y 的结果赋值给 z 。
  */;

  return x + y + z /*
    遇到 return 结束运行，
    返回 { value: x + y + z, done: true }
  */;
}

{% endhighlight %}


# Part II -- Babel 转换后的代码

{% highlight javascript %}

"use strict";

var _marked = [gen].map(regeneratorRuntime.mark);

// 获得一个遍历器对象
var runner = gen(3);

console.log(runner.next(4)); // { value: 3, done: false }
console.log(runner.next(5)); // { value: 5, done: false }
console.log(runner.next(6)); // { value: 14, done: true }

// 定义生成器
function gen(x) {
  var y, z;
  return regeneratorRuntime.wrap(function gen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return x;

        case 2:
          y = _context.sent;
          _context.next = 5;
          return y;

        case 5:
          z = _context.sent;
          return _context.abrupt("return", x + y + z /*
            遇到 return 结束运行，
            返回 { value: x + y + z, done: true }
          */);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

{% endhighlight %}
