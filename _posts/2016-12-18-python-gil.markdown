---
title: Python 有 GIL 为什么还要线程同步
date: 2016-12-18 22:19:00 +08:00
layout: post
---

- GIL 不能保证线程安全
- GIL 下线程分时间片执行
- 一个时间片内对数据修改没有完成，等到下一个时间片，数据有可能被别的线程修改
- GIL 保证 Python 解释器一次只执行一个线程，线程同步保证数据一致，这是两个完全不同的概念

> [Python有GIL为什么还需要线程同步](http://zhihu.com/question/23030421/answer/93789486)