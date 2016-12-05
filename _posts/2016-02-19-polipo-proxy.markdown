---
title: Polipo 开启 ShadowSocks HTTP 代理
date: 2016-02-19 19:07:38 +08:00
categories:
- proxy
layout: post
---

ShadowSocks 默认的代理是基于 SOCKS 5 的，除了浏览器以外使用起来不太方便，Polipo 给本地开启全局 HTTP 代理。

``` bash
# 安装 Polipo
brew install polipo
# 在 8123 端口代理到 ShadowSocks 的 1080 端口
polipo socksParentProxy=localhost:1080
# 测试代理
http_proxy=http://localhost:8123 curl www.google.com
```

参考链接：

* [shadowsocks-httpproxy](http://supercocoa.github.io/2015/10/24/shadowsocks-httpproxy/)
