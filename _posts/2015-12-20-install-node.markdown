---
title: 安装 Node 最新版本
date: 2015-12-20 09:15:40 Z
categories:
- nodejs
layout: post
---

# 通过 Node 版本管理器安装 Node，不支持 Windows ！！

``` bash
安装: npm i -g n && n --help

用法: n [options/env] [cmd] [args]

环境:
  n [cmd] [args]            Uses default env (node)
  n io [cmd]                Sets env as io

命令:
(node):
  n                              切换本地已安装的 node
  n latest                       安装或切换到最新版 node
  n -a x86 latest                上一条命令的 32 位版
  n stable                       安装或切换到最新稳定版 node
  n <version>                    安装指定版 node
  n use <version> [args ...]     使用指定版 node 和参数执行
  n bin <version>                输出指定版 node bin 路径
  n rm <version ...>             移除指定版 node
  n --latest                     输出最新版 node
  n --stable                     输出最新稳定版 node
  n ls                           列出所有 node 版本

(iojs):
  n io latest                    以下命令和上面的命令是一致的
  n io -a x86 latest             只不过是针对 iojs
  n io <version>
  n io use <version> [args ...]
  n io bin <version>
  n io rm <version ...>
  n io --latest
  n io ls

参数:
  -V, --version   当前 n 的版本
  -h, --help      查看帮助
  -q, --quiet     关闭 curl 输出 (如果可用)
  -d, --download  仅下载
  -a, --arch      覆盖系统架构 (看不懂)

别名:
  which   bin
  use     as
  list    ls
  -       rm
```

# 参考链接
- [node version manager](https://www.npmjs.com/package/n)
