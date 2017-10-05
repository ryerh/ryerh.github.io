---
title: Ubuntu 镜像
date: 2015-11-24 14:48:00 +08:00
categories:
- ubuntu
layout: post
---

# 使用说明

执行以下命令替换 `/etc/apt/sources.list` 文件：

``` bash
curl -o "/etc/apt/sources.list" "http://mirrors.163.com/.help/sources.list.$(grep -Po '(?<=DISTRIB_CODENAME=).*' /etc/lsb-release)"
```

或者下载相应版本的 `sources.list`：

- lucid(10.04)
- precise(12.04)
- trusty(14.04)
- utopic(14.10)
- vivid(15.04)
- wily(15.10)

# 参考链接

- [网易源](http://mirrors.163.com/.help/ubuntu.html)
