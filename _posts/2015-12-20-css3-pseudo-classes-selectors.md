---
layout: post
title:  "CSS3 伪类选择器之数量选定"
date:   2015-12-20 12:41:17 +0800
categories: css
---

# CSS3 计数规则

1. CSS 选择元素从 1 开始计数。
2. 伪类选择器 `:nth-child(n)` 参数 n 从 0 开始计数。

# child vs type

伪类选择器 `child` 和 `type` 两个版本，
本文的例子只针对 `child` 版本，下面给出完整对照表。

child 选择器    |    | type 选择器
-------------- | -- | ----------------
`first-child`    | -> | `first-of-type`
`last-child`     | -> | `last-of-type`
`nth-child`      | -> | `nth-of-type`
`nth-last-child` | -> | `nth-last-of-type`
`only-child`     | -> | `only-of-type`

# 实例代码

不打算配图了，诸看客自行脑补。

``` css
/* 第1项 - 不推荐用 :nth-child(1)，语义不明确 */
span:first-child {
    color: navy;
}

/* 最后1项 */
span:last-child {
    color: olive;
}

/* 唯一孩子节点 */
span:only-child {
    color: black;
}

/* 正数第x项 */
span:nth-child(5) {
    color: navy;
}

/* 倒数第x项 */
span:nth-last-child(5) {
    color: orange;
}

/* 前x项 - [1, 5] */
span:nth-child(-n+5) {
    color: red;
}

/* 后x项 - [n-4, n] */
span:nth-last-child(-n+5) {
    color: blue;
}

/* 忽略前x项 - [5, n] */
span:nth-child(n+5) {
    color: purple;
}

/* 忽略后x项 - [1, n-4] */
span:nth-last-child(n+5) {
    color: yellow;
}

/* 忽略前、后x项 - [5, n-4] */
span:nth-child(n+5):nth-last-child(n+5) {
    color: orange;
}

/* 奇数项 - odd = 2n ± 1 */
span:nth-child(odd) {
    color: red;
}

/* 偶数项 - even = 2n */
span:nth-child(even) {
    color: green;
}
```
