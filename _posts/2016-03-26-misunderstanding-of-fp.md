---
layout: post
title:  "我对函数式编程的一处误解"
date:   2016-03-26 17:04:18 +0800
categories: functional-programming
---

因为学艺不精，一直以来，我把函数式编程中副作用的概念看得非常之重。一贯秉承所有 JavaScript 变量都用 `const` 来声明的原则。但这并不容易做到，有的时候我不得不引入 `let` 和副作用。比如下面这个例子：

``` javascript
// 防止连续发出多个 Ajax 请求
let isRequesting = false

$('#fetch').on('click', () => {
    // 通过副作用避免多次请求
    if(isRequesting) {
        console.log('ajax still in progress, please wait')
        return false
    }

    // 正在请求
    isRequesting = true

    $.get(SOME_RESOURCE, (data) => {
        console.log('success with :', data)
        // 请求结束
        isRequesting = false
    })
})
```

我一直在考虑能否不引入 `isRequesting` 这个变量，就能达到目的。后来读了阮一峰博客中的这个例子，更加吸引了我的兴趣：

``` javascript
const clock = tickTock();
clock.next(); // tick
clock.next(); // tock
// ...

function* tickTock() {
    while(true) {
      console.log('tick');
      yield;

      console.log('tok');
      yield;
    }
}
```

在 `generator` 的帮助下，不引入副作用便实现了 `tick` 和 `tock` 的切换。我感觉很神奇，但这个 `tickTock` 的示例是同步执行 的，可以通过 `yield` 来暂缓执行。但是我所解决的防止重复 Ajax 请求的问题是异步执行的，`yield` 不能解决我心中的疑惑。

于是我去 StackOverflow 上提问：[How to prevent multiple Ajax requets without introducing side-effects](http://stackoverflow.com/questions/36100230/how-to-prevent-multiple-ajax-requets-without-introducing-side-effects)。

网友虽然没有按照我理想的方式给出答案，但却纠正了我的误区：函数式编程中 `immutable` 的意义在于尽可能降低副作用对程序的影响，而不是完全避免，副作用是无法避免的！

这两天读《JavaScript 函数式编程》和阮一峰的博客，也更加令我意识到自己陷入的误区：

> 当然，实际应用中，不做I/O是不可能的。因此，编程过程中，函数式编程只要求把I/O限制到最小，不要有不必要的读写行为，保持计算过程的单纯性。 —— 阮一峰博客

> 让我们面对现实。虽然能消除代码中所有不必要的突变和副作用是极好的，但是也有些时候，你需要改变一些状态。 —— 《JavaScript 函数式编程》

Haskell 在处理 I/O 的时候也是退化到命令式编程，但是依然不影响 Haskell 仍是一门函数式语言，而且很棒。

所以绕了一圈下来又回到了原点，而且感觉有些好笑，怎么会去执拗这么幼稚的问题。但事实是自己编程底子不好，也没有天赋，长久以来一直自学难免会踏入这些坑。很高兴能解开这个疑惑 :)
