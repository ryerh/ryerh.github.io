---
title: Git Cheat Sheet
date: 2015-11-24 14:40:00 +08:00
categories:
- git
- cheat sheet
layout: post
---

# 安装 Git

``` bash

# OSX
brew install git

# Ubuntu
sudo apt-get install git-core

```




# 配置 Git

``` bash

# 帮助
git help [cmd]

# 显示当前配置
git config --list [--system, --global, --local]

# 编辑配置文件
git config -e --global

# 配置用户
git config --global user.name    ryer.huang
git config --global user.email   ryerh@live.com

# 配置推送
git config --global push.default simple

# 生成 ssh keys
ssh-keygen -t rsa -C ryerh@live.com

# 查看 id_rsa.pub
cat ~/.ssh/id_rsa.pub

# 测试 SSH 配置
ssh -T git@github.com

```




# 创建项目

``` bash
# 初始化仓库
mkdir project && cd project
git init

# 克隆仓库
git clone git@hello-world.git

# 克隆单个分支
git clone -b master --single-branch git@hello-world.git
```




# 创建项目

``` bash
# 添加文件
git add . [file]

# 删除文件
git rm [file]
git rm --cached [file]

# 重命名
git mv [src] [dst]

# 提交暂存区的文件
git commit [file] -m "message" [-v]

# 追加到上次提交
git commit --amend [file1]
git commit --amend -m "message"

# 关联远程仓库
git remote add origin git@***.git

# 提交代码
git push

# 不 pull merge，强制 push
git push --force

# 更新仓库 [远程 分支:本地分支]
git pull [origin master:master]

# git pull 等同于下面
git fetch [origin master]
git merge origin/master

# 删除远程分支
git push origin --delete master

# 远程分支删除后，同步删除本地对应分支
git pull/fetch -p
```

# 参考链接
- [Git 远程操作详解](http://www.ruanyifeng.com/blog/2014/06/git_remote.html?bsh_bid=439347102)
- [常用 Git 命令清单](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)<br>
- [Git CheatSheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
