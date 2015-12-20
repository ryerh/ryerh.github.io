---
layout: post
title:  "Git 命令手册"
date:   2015-11-24 14:40:33 +0800
categories: git
---

# 安装 Git

{% highlight bash %}
# OSX
ryer:~ $ brew install git
# Ubuntu
ryer:~ $ sudo apt-get install git-core
{% endhighlight %}

# 配置 Git

{% highlight bash %}
# 帮助
ryer:~ $ git help [cmd]
# 显示当前配置
ryer:~ $ git config --list [--system, --global, --local]
# 编辑配置文件
ryer:~ $ git config
# 配置用户
ryer:~ $ git config --global user.name    ryer.huang
ryer:~ $ git config --global user.email   ryerh@live.com
# 配置推送
ryer:~ $ git config --global push.default simple
# 生成 ssh keys
ryer:~ $ ssh-keygen -t rsa -C ryerh@live.com
# 查看 id_rsa.pub
ryer:~ $ cat ~/.ssh/id_rsa.pub
{% endhighlight %}

# 使用 Git
{% highlight bash %}
# 初始化仓库
ryer:~ $ mkdir project && cd project
ryer:project $ git init
# 添加文件
ryer:project $ git add [file]
# 删除文件
ryer:project $ git rm [file]
ryer:project $ git rm --cached [file]
# 重命名
ryer:project $ git mv [src] [dst]
# 提交代码
ryer:project $ git commit -m [msg]
ryer:project $ git commit [file] -m [msg]
# 追加到上次提交
ryer:project $ git commit -a
# 追加到上次提交
ryer:project $ git commit --amend [file1]
# 克隆仓库
ryer:project $ git clone git@***.git
# 关联远程仓库
ryer:project $ git remote add origin git@***.git
# 提交代码
ryer:project $ git push
# 不 pull merge，强制 push
ryer:project $ git push --force
# 更新仓库 [远程 分支:本地分支]
ryer:project $ git pull [origin master:master]
# git pull 等同于下面
ryer:project $ git fetch [origin master]
ryer:project $ git merge origin/master
# 删除远程分支
ryer:project $ git push origin --delete master
# 远程分支删除后，同步删除本地对应分支
ryer:project $ git pull/fetch -p
{% endhighlight %}

# 参考链接
- [Git 远程操作详解](http://www.ruanyifeng.com/blog/2014/06/git_remote.html?bsh_bid=439347102)
- [常用 Git 命令清单](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)<br>
- [Git CheatSheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
