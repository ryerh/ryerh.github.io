---
layout: post
title:  "各种 Config 文件的存放路径"
date:   2016-05-07 16:40:09 +0800
categories: linux
---

# Unix/Linux

``` bash

# nginx.conf
$ sudo nginx -t

# apache
$ apachectl -V | grep SERVER_CONFIG_FILE

# my.cnf
$ mysql --help | grep -A 1 'Default options'

# php.ini
$ php --ini

# php-fpm.conf
$ php-fpm -t

# .gitconfig
$ git config --system|global|local -e

```
