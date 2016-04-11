---
layout: post
title:  "Ubuntu 安装 Python Scrapy，修改 Pip 源"
date:   2016-04-08 23:32:00 +0800
categories: python
---

在全新安装的 Ubuntu 中安装 Scrapy

{% highlight bash %}

sudo apt-get install python-dev libffi-dev libssl-dev libxml2-dev libxslt1-dev

pip install lxml      -i http://pipy.douban.com/simple
pip install pyopenssl -i http://pipy.douban.com/simple
pip install scrapy    -i http://pipy.douban.com/simple

{% endhighlight %}
