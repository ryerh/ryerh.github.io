---
title: linux 初始化工具
date: 2016-06-29 02:49:27 Z
categories:
- linux
layout: post
---

# linux 系统安装后的工具集

``` bash
# centos mirror
$ mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
$ wget http://mirrors.163.com/.help/CentOS7-Base-163.repo
$ yum clean all
$ yum makecache

# ubuntu mirror
$ sudo vim /etc/apt/sources.list
$ sudo apt-get update
deb http://mirrors.163.com/ubuntu/ wily main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ wily-security main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ wily-updates main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ wily-proposed main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ wily-backports main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ wily main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ wily-security main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ wily-updates main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ wily-proposed main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ wily-backports main restricted universe multiverse

lucid(10.04)
precise(12.04)
trusty(14.04)
utopic(14.10)
vivid(15.04)
wily(15.10)

# nvm
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

# pip
$ wget https://bootstrap.pypa.io/get-pip.py
$ sudo python get-pip.py

# shadowsocks json
{
  "server": "23.105.204.71",
  "server_port": 10086,
  "local_address": "127.0.0.1",
  "local_port": 1080,
  "password": "password",
  "timeout": 300,
  "method": "aes-256-cfb",
  "fast_open": false,
  "workers": 2
}
```
