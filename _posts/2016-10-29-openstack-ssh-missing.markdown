---
title: 私钥丢失无法登陆 OpenStack 虚机解决方案
date: 2016-10-29 12:43:00 +08:00
layout: post
---

假设原来有一个实例 `original-vm`，后来由于本地重装系统导致 SSH 私钥丢失无法登陆到 `original-vm`，可采用如下办法。

1. 本地通过 `ssh-kegen -t rsa -C COMMENT`，创建一个新的密钥对。
2. 给 `original-vm` 创建一个快照 `original-vm-snapshot`。
3. 创建一个新的实例 `resume-vm`，创建时选择从快照 `original-vm-snapshot` 启动，并选择上面创建的新密钥对。

【完】