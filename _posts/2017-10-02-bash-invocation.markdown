---
title: Bash 的调用形式
date: 2017-10-02 14:39:00 +08:00
layout: post
---

# Login Shell (Interactive or Non-Interactive)
- 进入：`bash --login`、`-bash`
- 特征：`$0` 参数以 `-` 打头
- 启动：
  1. 执行 `/etc/profile`
  2. 执行按照 `~/.bash_profile`、`~/.bash_login`、`~/.profile` 的顺序执行找到的第一个脚本
  3. 指定 `--noprofile` 参数则不会预先执行任何文件
- 退出：执行 `~/.bash_logout`

# Interactive Non-Login Shell
- 进入：`bash`、`bash -i`
- 特征：
  1. `PS1` 生效
  2. `$-` 包含 `i`
- 启动：
  1. 执行 `/etc/bash.bashrc` (macOS 没有这一步)
  2. 执行 `~/.bashrc`
  3. 指定 `--norc` 参数则不会预先执行任何文件
  4. 指定 `--rcfile` 指定新的 `rcfile` 路径

# Non-Login Non-Interactive Shell
- 进入：`BASH_ENV=/path/to/env bash -c 'env'`、`ssh root@domain env`
- 启动：`source $BASH_ENV`（如果存在，为了避免引入问题不会预执行任何文件）

# 拓展阅读（`man bash`）
- 以 `sh` 启动
- 以 `--posix` 启动
- 以 `rshd`