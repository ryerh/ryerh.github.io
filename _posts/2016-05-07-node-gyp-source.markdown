---
title: node-gyp 指定源码
date: 2016-05-07 19:07:19 +08:00
categories:
- blog
layout: post
---

使用 cnpm install 可以避免 node-gyp 编译的时候卡死

``` bash
$ node-gyp install --dist-url https://npm.taobao.org/mirrors/node
```
