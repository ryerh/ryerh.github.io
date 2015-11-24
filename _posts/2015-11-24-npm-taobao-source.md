---
layout: post
title:  "淘宝 npm 镜像"
date:   2015-11-24 14:55:38 +0800
categories: utility
---

使用淘宝 cnpm 替代 npm:

{% highlight bash %}
ryer:~ ryer$ npm install -g cnpm --registry=https://registry.npm.taobao.org
{% endhighlight %}

或者你直接通过添加 npm 参数 alias 一个新命令:


{% highlight bash %}

ryer:~ ryer$ alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"
{% endhighlight %}


Or alias it in .bashrc or .zshrc:

{% highlight bash %}
ryer:~ ryer$ echo '\n#alias for cnpm\nalias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"' >> ~/.zshrc && source ~/.zshrc
{% endhighlight %}


直接指定 npm 源:

{% highlight bash %}
ryer:~ ryer$ npm config set registry https://registry.npm.taobao.org
{% endhighlight %}

> http://npm.taobao.org
