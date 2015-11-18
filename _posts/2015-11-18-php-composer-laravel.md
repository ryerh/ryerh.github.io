---
layout: post
title:  "使用国内 composer 源创建 laravel 项目"
date:   2015-11-18 17:26:58 +0800
categories: php
---

## OSX 安装 `composer` 包管理器
```bash
ryer:~ ryer$ brew install composer
```

## 替换国内源
```bash
ryer:~ ryer$ composer config -g repositories.packagist composer http://packagist.phpcomposer.com
```

## 创建 laravel 项目
不要用 laravel installer 安装 laravel 项目，安装过程中会请求 laravel 的安装包，被墙了。
```bash
ryer:~ ryer$ composer create-project laravel/laravel PROJECT-NAME --prefer-dist
```

> 注意：为了避免安装包的时候都要执行两次查询，切记要添加禁用 packagist 的设置。<br>
> 进入 laravel 项目目录，打开 composer.json，在末尾添加如下配置信息：
```json
{
    "repositories": [
        {"type": "composer", "url": "http://packagist.phpcomposer.com"},
        {"packagist": false}
    ]
}
```
