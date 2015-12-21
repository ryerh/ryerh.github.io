---
layout: post
title:  "npm 命令手册"
date:   2015-11-24 14:55:38 +0800
categories: utility
---

# 使用淘宝源

{% highlight bash %}
ryer:~ $ npm config set registry https://registry.npm.taobao.org
ryer:~ $ npm config set strict-ssl false
{% endhighlight %}

# 配置

{% highlight bash %}
ryer:~ $ npm config ls [-g]
{% endhighlight %}

# 初始化 package.json

{% highlight bash %}
ryer:~ $ npm init
{% endhighlight %}

# 安装、删除包

{% highlight bash %}
ryer:~ $ npm install [pkg] [--save, --save-dev, --save-optional]
ryer:~ $ npm uninstall [pkg] [--save, --save-dev, --save-optional]
{% endhighlight %}

# 查看安装的包

{% highlight bash %}
ryer:~ $ npm ls -g --depth=0
{% endhighlight %}

# 参考链接
- [淘宝 npm 源](http://npm.taobao.org)
- [npm 官方文档](https://docs.npmjs.com/getting-started/what-is-npm)
