---
title: 面试题 - 递归/尾递归/Continuation 阶乘分析
date: 2016-12-23 12:02:00 +08:00
layout: post
---

### 请从递归、尾递归优化、爆栈角度分析如下代码

```js
function factorial(n) {
  if (n === 0) return 1
  return n * factorial(n - 1)
}
const v1 = factorial(4)

function tail_factorial(n, acc = 1) {
  if (n === 0) return acc
  return tail_factorial(n - 1, acc * n)
}
const v2 = tail_factorial(4)

const identity = v => v
function next_factorial(n, next = identity) {
  if (n === 0) return next(1)
  return next_factorial(n - 1, r => next(n * r))
}
const v3 = next_factorial(4)

console.log(v1, v2, v3)
```