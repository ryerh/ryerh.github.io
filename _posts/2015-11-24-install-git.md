---
layout: post
title:  "安装 git"
date:   2015-11-24 14:40:33 +0800
categories: utility
---

### OSX

{% highlight bash %}
ryer:~ ryer$ brew install git
{% endhighlight %}

### Ubuntu

{% highlight bash %}
ryer:~ ryer$ sudo apt-get install git-core
{% endhighlight %}

### 配置 git

{% highlight bash %}
ryer:~ ryer$ git config --global user.name    ryer.huang
ryer:~ ryer$ git config --global user.email   ryerh@live.com
ryer:~ ryer$ git config --global push.default simple
{% endhighlight %}

### 配置 ssh

{% highlight bash %}
ryer:~ ryer$ ssh-keygen -t rsa -C "ryerh@live.com"
{% endhighlight %}

