---
title: Ubuntu 安装 Python Scrapy，修改 Pip 源
date: 2016-04-08 15:32:00 Z
categories:
- python
layout: post
---

# 设置 Pypi 源 `~/.pip/pip.conf`

``` bash

[global]
index-url = http://pypi.douban.com/simple

[install]
trusted-host = pypi.douban.com

```


# 在全新安装的 Ubuntu 中安装 Scrapy

``` bash

sudo apt-get install python-dev python-pip libxml2-dev libxslt1-dev zlib1g-dev libffi-dev libssl-dev
pip install scrapy

```

# 参考链接

* [Scrapy Documentation](http://doc.scrapy.org/en/latest/)
