---
layout: post
title:  "NPM 命令手册"
date:   2015-11-24 14:55:38 +0800
categories: npm
---

# NPM 控制命令

{% highlight bash %}
# 帮助
npm help <cmd>

# 使用淘宝源
npm config set registry https://registry.npm.taobao.org
npm config set strict-ssl false

# 升级 NPM
sudo npm i npm [-g|--global]

# 版本控制
Patch releases(最后一位): 1.0 or 1.0.x or ~1.0.4
Minor releases(中间一位): 1   or 1.x   or ^1.0.4
Major releases(最前一位): *   or x

# 修改配置
npm config set <key> <value> [-g]
npm config get <key>
npm config delete <key>
npm config edit [-g]
npm get <key>
npm set <key> <value> [-g]

# 查看配置
npm config ls [-g] [-l|--long]

# NPM 全局包位置
npm get prefix

# 初始化 package.json
npm init [-y|--yes]
{% endhighlight %}

# NPM 包管理命令

{% highlight bash %}

# 安装包 install
npm i <pkg> [-S|--save, -D|--save-dev, -O|--save-optional]

# 删除包 uninstall
npm rm <pkg> [-S, -D, -O]

# 更新包
npm update <pkg> [-g]
npm update <pkg> [-g] --depth 999 # 连依赖一起更新

# 列出过期的包
npm outdated [-g]

# 查看安装的包
npm ls/ll [-g] --depth 0
{% endhighlight %}

# 一个很好玩的命令

{% highlight bash %}
npm explore <pkg> [-g]
{% endhighlight %}

# 参考链接
- [淘宝 npm 源](http://npm.taobao.org)
- [npm 官方文档](https://docs.npmjs.com/getting-started/what-is-npm)
