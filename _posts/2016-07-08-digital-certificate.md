---
layout: post
title:  "开发数字签名应用"
date:   2016-07-08 17:25:14 +0800
categories: cryptology
---

## 数字签名概念

证书中心：

1. 证书中心的公钥（根证书）是公开的，存放在浏览器的信任列表里；
2. 证书中心用自己的私钥（根密钥）+ Bob 的公钥 + Bob 的个人信息生成 Bob 的 CA 证书（二级证书）；
3. CA 证书寄即可作为 Bob 身份鉴别的依据。

Alice 访问 Bob：

1. Alice 访问 Bob 的网站，请求页面；
1. Bob 生成页面，计算 Hash，用自己的私钥加密 Hash 得到 Signature，附带自己的 CA 证书（页面 + Signature + CA）；
2. Alice 用证书中心的公钥解开 CA 证书，得到 Bob 的公钥，用公钥解开 Signature 得到 Hash，然后匹配页面的 Hash；
3. Alice 用 Bob 的公钥加密，发送信息给 Bob；
4. Bob 用自己的私钥解密。

## 自建证书中心服务

所需命令行工具：`openssl`

## 参考链接：
* [基于OpenSSL自建CA和颁发SSL证书](http://seanlook.com/2015/01/18/openssl-self-sign-ca/)
