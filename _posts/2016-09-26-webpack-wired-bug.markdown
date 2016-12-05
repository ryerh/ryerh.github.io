---
title: 一个 Webpack 导致的诡异 bug
date: 2016-09-26 06:20:36 Z
categories:
- webpack
layout: post
---

一个 Webpack + React + React-bootstrap-table 项目，
因为 fork 了一份 bs-table 准备改写源码，于是将克隆的 bs-table 放在了项目同级目录，
然后在项目根目录通过软链接指向 bs-table。

结果项目里 `import { xxx } from '../../bs-table'` 之后一直报错，经 debug 一小时后，
确认是由于 bs-table 的真实路径导致，
于是将 bs-table 从项目同级转移到了项目的 `node-modules/bs-table` 中，
问题依旧。

进一步 debug 确认是由于 `bs-table/node_modules` 的存在而导致的各种问题，
将 `bs-table/node_modules` 删之，问题解决。

Bug 的原因可能是由于 Webpack 的路径解析机制（软链接被解析为真实绝对路径）和模块加载机制（并没有寻找项目的 node_modules 而是寻找 bs-table 的 node_modules）导致的，尚不确定原因，记录于此，待细究。
