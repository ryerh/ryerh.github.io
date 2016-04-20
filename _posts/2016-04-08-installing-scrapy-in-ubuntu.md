---
layout: post
title:  "Ubuntu 安装 Python Scrapy，修改 Pip 源"
date:   2016-04-08 23:32:00 +0800
categories: python
---

# 设置 Pypi 源 (~/.pip/pip.conf)

{% highlight bash %}

[global]
index-url = http://pypi.douban.com/simple

[install]
trusted-host = pypi.douban.com

{% endhighlight %}


# 在全新安装的 Ubuntu 中安装 Scrapy

{% highlight bash %}

sudo apt-get install python-dev libffi-dev libssl-dev libxml2-dev libxslt1-dev

pip install lxml
pip install pyopenssl
pip install scrapy

{% endhighlight %}
