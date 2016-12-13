---
title: Docker Cheatsheet
date: 2016-10-30 22:53:00 +08:00
layout: post
---

## 使用演示
```
$ docker run -it -P \
    --name dev-env \
    -v /Users/ryer/Developer:/root/shared \
    -p 2000-3000:2000-3000 \
    centos:latest /bin/bash
```

## 获得帮助
```
$ docker --help
$ docker COMMAND --help
```

## 创建 & 运行
```
# 拉取镜像
$ docker pull IMAGE_NAME[:TAG|@DIGEST]

# 运行容器
$ docker run                   \
    [-it]                      \ # interactive pseudo-tty
    [--rm]                     \ # remove after detach
    [--name CONTAINER_NAME]    \ # default to a random name
    [--network=NETWORK_NAME]   \ # default to `bridge`
    [-v /some/path:/some/path] \ # mount volume
    [-p some-port:some-port]   \ # publish specific ranged ports
    [-P]                       \ # publish all ports
    IMAGE_NAME[:TAG|@DIGEST]   \
    /bin/bash

# 退出、返回容器
root@af8bae53bdd3:/# exit 或 ^D
$ docker atttach CONTAINER_NAME

# 终止、启动容器
$ docker stop CONTAINER_NAME
$ docker start CONTAINER_NAME
$ docker restart CONTAINER_NAME
```

## 状态 & 信息
```
# 列出容器
$ docker ps -a

# 列出镜像
$ docker images

# 容器日志
$ docker logs CONTAINER_NAME

# 审查
$ docker inspect container CONTAINER_NAME
$ docker inspect image IMAGE_NAME
$ docker inspect task TASK_NAME
```

## 网络管理
```
$ docker network ls
$ docker network inspect NETWORK_NAME
$ docker network disconnect NETWORK_NAME CONTAINER_NAME
$ docker network create -d DRIVER NETWORK_NAME
$ docker network connect NETWORK_NAME CONTAINER_NAME
```

## 清理
```
$ docker rm CONTAINER_NAME
$ docker rmi IMAGE_NAME
```