---
title: OSX Homebrew Cask 包管理
date: 2016-01-21 09:06:30 Z
categories:
- homebrew
layout: post
---

# 安装 Homebrew Cask，需要 XCode

``` bash
# 安装 Homebrew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# 安装 Homebrew Cask
brew tap caskroom/cask

# 软件包下载目录
brew --cache

# 错误排查
brew update (两次)
brew doctor
```

# Homebrew 包管理命令

``` bash
# 安装软件包
brew install $FORMULA

# 只安装依赖
brew install --only-dependencies $FORMULA

# 查看依赖
brew deps $FORMULA

# 删除软件包
brew rm $FORMULA

# 更新 Homebrew 本身
brew update

# 列出过时的软件包
brew outdated

# 更新所有软件包
brew upgrade

# 更新指定软件包
brew upgrade $FORMULA

# 切换软件包版本
brew info $FORMULA
brew switch $FORMULA $VERSION

# 清除软件包的旧版本
brew cleanup $FORMULA

# 清除所有软件包的旧版本
brew cleanup

# 查看可以被清除的软件包
brew cleanup -n
```
