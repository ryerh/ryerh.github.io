---
title: Docker 简析 1 - 镜像与容器
date: 2017-03-17 02:31:00 +08:00
layout: post
---

## 环境说明

- 操作系统：`CentOS-7-1611, 3.10.0-514.el7.x86_64`（全新安装）
- Docker 版本：`17.03.0-ce, build 3a232c8`
- 接下来全文如果没有特殊说明，均认为当前处于 `/var/lib/docker` 目录下

## 初次安装

操作系统初次安装，Docker 服务初次启动后，执行 `tree` 命令查看 Docker 软件目录内容如下：

```shell
[root@localhost docker]# tree
/var/lib/docker
|-- containers
|-- image
|   `-- overlay
|       |-- distribution
|       |-- imagedb
|       |   |-- content
|       |   |   `-- sha256
|       |   `-- metadata
|       |       `-- sha256
|       |-- layerdb
|       `-- repositories.json
|-- network
|   `-- files
|       `-- local-kv.db
|-- overlay
|-- plugins
|   |-- storage
|   |   `-- blobs
|   |       `-- tmp
|   `-- tmp
|-- swarm
|-- tmp
|-- trust
`-- volumes
    `-- metadata.db
```

以上大致可以看出的信息有：

1. 容器、镜像、网络、文件系统、插件、集群配置、数据卷等，统一在 `/var/lib/docker` 目录下被 Docker 所管理
2. Docker 以 `metadata` 和 `content` 的方式管理镜像资源

## 拉取第一个镜像

这里我们拉取 alpine 镜像的 3.4 版本，因为在此刻写这篇分析时，绝大部分以 alpine 为基础镜像的镜像，所采用的还都是 3.4 版本。

```shell
[root@localhost docker]# docker pull alpine:3.4
3.4: Pulling from library/alpine
709515475419: Pull complete
Digest: sha256:39d4b2f8d3f37bc1321b04ca9bca0681c6ba65ef5a8610793383710e3aecf8b5
Status: Downloaded newer image for alpine:3.4
```

第一个镜像 `alpine:3.4` 拉取完毕，因为 alpine 是**基础镜像**，所以它只有一层 `pullid(709515475419)`。镜像的摘要是 `sha256:39d4b2f8d3f37b…`。

再次执行 `tree` 命令查看 Docker 软件目录内容如下（省略了深层的子级内容）：

```shell
[root@localhost docker]# tree
/var/lib/docker
|-- containers
|-- image
|   `-- overlay
|       |-- distribution
|       |   |-- diffid-by-digest
|       |   |   `-- sha256
|       |   |       `-- 7095154754192bfc2306f3b2b841ef82771b7ad39526537234adb1e74ae81a93
|       |   `-- v2metadata-by-diffid
|       |       `-- sha256
|       |           `-- 9f8566ee5135862dd980160c27bd7721448a6f7f385bbb81f7f001f1b78a5fbf
|       |-- imagedb
|       |   |-- content
|       |   |   `-- sha256
|       |   |       `-- 245f7a86c576bd7e3bef9b88bd97debdc9a8b14c185da6a74bdf3e4be40ea86b
|       |   `-- metadata
|       |       `-- sha256
|       |-- layerdb
|       |   |-- sha256
|       |   |   `-- 9f8566ee5135862dd980160c27bd7721448a6f7f385bbb81f7f001f1b78a5fbf
|       |   `-- tmp
|       `-- repositories.json
|-- network
|   `-- files
|       `-- local-kv.db
|-- overlay
|   `-- 94cb6c62c07230ec6567622f5f201c64998c604853a3791b9adfcbfaef6f2d62
|       `-- root
|-- plugins
|   |-- storage
|   |   `-- blobs
|   |       `-- tmp
|   `-- tmp
|-- swarm
|-- tmp
|-- trust
`-- volumes
    `-- metadata.db
```

发现 `pullid(709515475419)` 其实就是 `diffid(709515475419...)`，而镜像摘要（`sha256:39d4b2f8d3f37b...`）没有指向任何线索。

顺藤摸瓜，`diffid` 的文件内容如下：

```shell
[root@localhost docker]# cat image/overlay/distribution/diffid-by-digest/sha256/709515475419*
sha256:9f8566ee5135862dd980160c27bd7721448a6f7f385bbb81f7f001f1b78a5fbf
```

根据 `diffid` 的内容，发现有两个文件与之相关，分别查看其内容：

```shell
# 文件 1
[root@localhost docker]# cat image/overlay/distribution/v2metadata-by-diffid/sha256/9f8566ee5135862dd9801... | python -m json.tool
[
    {
        # 又回到了 diffid
        "Digest": "sha256:7095154754192bfc2306f3b2b841ef82771b7ad39526537234adb1e74ae81a93",
        "HMAC": "",
        "SourceRepository": "docker.io/library/alpine"
    }
]

# 文件 2
[root@localhost docker]# ll image/overlay/layerdb/sha256/9f8566ee5135862dd9801.../
total 32
-rw-r--r--. 1 root root    64 Mar 16 10:30 cache-id
    # 内容：94cb6c62c07230ec6567622f5f201c64998c604853a3791b9adfcbfaef6f2d62
    # 新线索！！！指向 overlay/94cb6c62c07230ec6...
-rw-r--r--. 1 root root    71 Mar 16 10:30 diff
    # 内容：sha256:9f8566ee5135862dd980160c27bd7721448a6f7f385bbb81f7f001f1b78a5fbf
    # 又是 diffid
-rw-r--r--. 1 root root     7 Mar 16 10:30 size
    # 内容：4803385
    # 大约是 4.58 MB
-rw-r--r--. 1 root root 17123 Mar 16 10:30 tar-split.json.gz
    # 内容：
    # {"type":2,"payload":"YmluLwAAAAAAAAAAAAAAAAAAAAA...","position":0}
    # {"type":1,"name":"bin/","payload":null,"position":1}
    # {"type":2,"payload":"YmluL2FzaAAAAAAAAAAAAAAAAA...=","position":2}
    # {"type":1,"name":"bin/ash","payload":null,"position":3}
    # {"type":2,"payload":"YmluL2Jhc2U2NAAAAAAAAAAAAAA...","position":4}
    # {"type":1,"name":"bin/base64","payload":null,"position":5}
    # {"type":2,"payload":"YmluL2JiY29uZmlnAAAAAAAAAAA...","position":6}
    # ...很长很长...
```

我们得到的唯一线索就是文件 2 所透露的 `cache-id`，找到与之相关的文件内容如下：

```shell
[root@localhost docker]# ls overlay/94cb6c62c07230ec6*/root/
bin  dev  etc  home  lib  linuxrc  media  mnt  proc  root  run  sbin  srv  sys  tmp  usr  var
```

发现了一个 Linux 的文件系统！这应该就是 alpine 镜像包含的文件系统吧。

至此，除了镜像摘要（`sha256:39d4b2f8d3f37b...`）没有指向任何线索，无处可寻之外，我们还有一出遗漏，通过执行 `docker image ls` 命令，可以看到 `alpine:3.4` 的 `imageid(245f7a86c576)` 。

```shell
[root@localhost docker]# docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
alpine              3.4                 245f7a86c576        12 days ago         4.8 MB
```

`imageid(245f7a86c576)` 指向的恰好就是我们遗漏的最后一个文件：

```shell
[root@localhost docker]# find -name 245f7a86c576*
./image/overlay/imagedb/content/sha256/245f7a86c576bd7e3bef9b88bd97debdc9a8b14c185da6a74bdf3e4be40ea86b

[root@localhost docker]# find -name 245f7a86c576* | cat | python -m json.tool
{
    "architecture": "amd64",
    "config": {
        "AttachStderr": false,
        "AttachStdin": false,
        "AttachStdout": false,
        "Cmd": null,
        "Domainname": "",
        "Entrypoint": null,
        "Env": [
            "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ],
        "Hostname": "837a64dcc771",
        "Image": "",
        "Labels": null,
        "OnBuild": null,
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "User": "",
        "Volumes": null,
        "WorkingDir": ""
    },
    "container": "837a64dcc771f14e4a2c2c3112a6bb4041fd4767750e164b04656351ed7b284e",
    "container_config": {
        "AttachStderr": false,
        "AttachStdin": false,
        "AttachStdout": false,
        "Cmd": [
            "/bin/sh",
            "-c",
            "#(nop) ADD file:3df55c321c1c8d73f22bc69240c0764290d6cb293da46ba8f94ed25473fb5853 in / "
        ],
        "Domainname": "",
        "Entrypoint": null,
        "Env": [
            "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ],
        "Hostname": "837a64dcc771",
        "Image": "",
        "Labels": null,
        "OnBuild": null,
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "User": "",
        "Volumes": null,
        "WorkingDir": ""
    },
    "created": "2017-03-03T20:32:21.010554522Z",
    "docker_version": "1.12.6",
    "history": [
        {
            "created": "2017-03-03T20:32:21.010554522Z",
            "created_by": "/bin/sh -c #(nop) ADD file:3df55c321c1c8d73f22bc69240c0764290d6cb293da46ba8f94ed25473fb5853 in / "
        }
    ],
    "os": "linux",
    "rootfs": {
        "diff_ids": [
            "sha256:9f8566ee5135862dd980160c27bd7721448a6f7f385bbb81f7f001f1b78a5fbf"
        ],
        "type": "layers"
    }
}
```

还是没有发现镜像摘要（`sha256:39d4b2f8d3f37b...`），倒是在 `rootfs.diff_ids` 中又发现了我们熟悉的 `layerdbid(9f8566ee5135...)`。

## 拉取第二个镜像

```shell
[root@localhost docker]# docker pull nginx:alpine
alpine: Pulling from library/nginx
709515475419: Already exists
5142c3ee45c6: Pull complete
6393d8407bbe: Pull complete
0816ea01673a: Pull complete
Digest: sha256:aa0daf2b17c370a1da371a767110a43b390a9db90b90d2d1b07862dc81754d61
Status: Downloaded newer image for nginx:alpine
```

`nginx:alpine` 是以 `alpine:3.4` 为基础镜像构建出来的，因为 `pullid(709515475419)` 这一层（也就是 alpine 唯一的一层）已经存在了，所以就直接复用，不必再下载。

通过 `docker image ls` 命令，我们得知 `imageid(0ae090dba3ab)` 是 `nginx:alpine` 镜像的最顶层：

```shell
[root@localhost docker]# docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               alpine              0ae090dba3ab        12 days ago         54.3 MB
alpine              3.4                 245f7a86c576        12 days ago         4.8 MB
```

按照我们前面进行线索追踪的经验，得知  `imageid(0ae090dba3ab)` 对应的文件内容：

```shell
[root@localhost docker]# find -name 0ae090dba3ab*
./image/overlay/imagedb/content/sha256/0ae090dba3ab6fd0a02a5eaddc19abf6bb47b9cf1b1168bd27aabf6fac05b399

[root@localhost docker]# find -name 0ae090dba3ab* | cat | python -m json.tool
{
    "architecture": "amd64",
    "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
    "config": {
        "ArgsEscaped": true,
        "AttachStderr": false,
        "AttachStdin": false,
        "AttachStdout": false,
        "Cmd": [
            "nginx",
            "-g",
            "daemon off;"
        ],
        "Domainname": "",
        "Entrypoint": null,
        "Env": [
            "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "NGINX_VERSION=1.11.10"
        ],
        "ExposedPorts": {
            "443/tcp": {},
            "80/tcp": {}
        },
        "Hostname": "837a64dcc771",
        "Image": "sha256:1a5ecdb942a15a03b2e03a9f50b52ec7bc15cf71f2139e6cc273a471a4cedfc3",
        "Labels": {},
        "OnBuild": [],
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "User": "",
        "Volumes": null,
        "WorkingDir": ""
    },
    "container": "a2aeb0fdbc463438259580c48c0521167a6a0926fe96d607349a3b061b9bab1d",
    "container_config": {
        "ArgsEscaped": true,
        "AttachStderr": false,
        "AttachStdin": false,
        "AttachStdout": false,
        "Cmd": [
            "/bin/sh",
            "-c",
            "#(nop) ",
            "CMD [\"nginx\" \"-g\" \"daemon off;\"]"
        ],
        "Domainname": "",
        "Entrypoint": null,
        "Env": [
            "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "NGINX_VERSION=1.11.10"
        ],
        "ExposedPorts": {
            "443/tcp": {},
            "80/tcp": {}
        },
        "Hostname": "837a64dcc771",
        "Image": "sha256:1a5ecdb942a15a03b2e03a9f50b52ec7bc15cf71f2139e6cc273a471a4cedfc3",
        "Labels": {},
        "OnBuild": [],
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "User": "",
        "Volumes": null,
        "WorkingDir": ""
    },
    "created": "2017-03-03T22:03:01.815836512Z",
    "docker_version": "1.12.6",
    "history": [
        {
            "created": "2017-03-03T20:32:21.010554522Z",
            "created_by": "/bin/sh -c #(nop) ADD file:3df55c321c1c8d73f22bc69240c0764290d6cb293da46ba8f94ed25473fb5853 in / "
        },
        {
            "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
            "created": "2017-03-03T22:02:09.823740715Z",
            "created_by": "/bin/sh -c #(nop)  MAINTAINER NGINX Docker Maintainers \"docker-maint@nginx.com\"",
            "empty_layer": true
        },
        {
            "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
            "created": "2017-03-03T22:02:10.11173297Z",
            "created_by": "/bin/sh -c #(nop)  ENV NGINX_VERSION=1.11.10",
            "empty_layer": true
        },
        {
            "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
            "created": "2017-03-03T22:03:00.145120559Z",
            "created_by": "/bin/sh -c GPG_KEYS=B0F4253373F8F6F510D42178520A9993A1C052F8 \t&& CONFIG=\"\t\t--prefix=/etc/nginx \t\t--sbin-path=/usr/sbin/nginx \t\t--modules-path=/usr/lib/nginx/modules \t\t--conf-path=/etc/nginx/nginx.conf \t\t--error-log-path=/var/log/nginx/error.log \t\t--http-log-path=/var/log/nginx/access.log \t\t--pid-path=/var/run/nginx.pid \t\t--lock-path=/var/run/nginx.lock \t\t--http-client-body-temp-path=/var/cache/nginx/client_temp \t\t--http-proxy-temp-path=/var/cache/nginx/proxy_temp \t\t--http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \t\t--http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \t\t--http-scgi-temp-path=/var/cache/nginx/scgi_temp \t\t--user=nginx \t\t--group=nginx \t\t--with-http_ssl_module \t\t--with-http_realip_module \t\t--with-http_addition_module \t\t--with-http_sub_module \t\t--with-http_dav_module \t\t--with-http_flv_module \t\t--with-http_mp4_module \t\t--with-http_gunzip_module \t\t--with-http_gzip_static_module \t\t--with-http_random_index_module \t\t--with-http_secure_link_module \t\t--with-http_stub_status_module \t\t--with-http_auth_request_module \t\t--with-http_xslt_module=dynamic \t\t--with-http_image_filter_module=dynamic \t\t--with-http_geoip_module=dynamic \t\t--with-http_perl_module=dynamic \t\t--with-threads \t\t--with-stream \t\t--with-stream_ssl_module \t\t--with-stream_ssl_preread_module \t\t--with-stream_realip_module \t\t--with-stream_geoip_module=dynamic \t\t--with-http_slice_module \t\t--with-mail \t\t--with-mail_ssl_module \t\t--with-compat \t\t--with-file-aio \t\t--with-http_v2_module \t\" \t&& addgroup -S nginx \t&& adduser -D -S -h /var/cache/nginx -s /sbin/nologin -G nginx nginx \t&& apk add --no-cache --virtual .build-deps \t\tgcc \t\tlibc-dev \t\tmake \t\topenssl-dev \t\tpcre-dev \t\tzlib-dev \t\tlinux-headers \t\tcurl \t\tgnupg \t\tlibxslt-dev \t\tgd-dev \t\tgeoip-dev \t\tperl-dev \t&& curl -fSL http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz -o nginx.tar.gz \t&& curl -fSL http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz.asc  -o nginx.tar.gz.asc \t&& export GNUPGHOME=\"$(mktemp -d)\" \t&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys \"$GPG_KEYS\" \t&& gpg --batch --verify nginx.tar.gz.asc nginx.tar.gz \t&& rm -r \"$GNUPGHOME\" nginx.tar.gz.asc \t&& mkdir -p /usr/src \t&& tar -zxC /usr/src -f nginx.tar.gz \t&& rm nginx.tar.gz \t&& cd /usr/src/nginx-$NGINX_VERSION \t&& ./configure $CONFIG --with-debug \t&& make -j$(getconf _NPROCESSORS_ONLN) \t&& mv objs/nginx objs/nginx-debug \t&& mv objs/ngx_http_xslt_filter_module.so objs/ngx_http_xslt_filter_module-debug.so \t&& mv objs/ngx_http_image_filter_module.so objs/ngx_http_image_filter_module-debug.so \t&& mv objs/ngx_http_geoip_module.so objs/ngx_http_geoip_module-debug.so \t&& mv objs/ngx_http_perl_module.so objs/ngx_http_perl_module-debug.so \t&& mv objs/ngx_stream_geoip_module.so objs/ngx_stream_geoip_module-debug.so \t&& ./configure $CONFIG \t&& make -j$(getconf _NPROCESSORS_ONLN) \t&& make install \t&& rm -rf /etc/nginx/html/ \t&& mkdir /etc/nginx/conf.d/ \t&& mkdir -p /usr/share/nginx/html/ \t&& install -m644 html/index.html /usr/share/nginx/html/ \t&& install -m644 html/50x.html /usr/share/nginx/html/ \t&& install -m755 objs/nginx-debug /usr/sbin/nginx-debug \t&& install -m755 objs/ngx_http_xslt_filter_module-debug.so /usr/lib/nginx/modules/ngx_http_xslt_filter_module-debug.so \t&& install -m755 objs/ngx_http_image_filter_module-debug.so /usr/lib/nginx/modules/ngx_http_image_filter_module-debug.so \t&& install -m755 objs/ngx_http_geoip_module-debug.so /usr/lib/nginx/modules/ngx_http_geoip_module-debug.so \t&& install -m755 objs/ngx_http_perl_module-debug.so /usr/lib/nginx/modules/ngx_http_perl_module-debug.so \t&& install -m755 objs/ngx_stream_geoip_module-debug.so /usr/lib/nginx/modules/ngx_stream_geoip_module-debug.so \t&& ln -s ../../usr/lib/nginx/modules /etc/nginx/modules \t&& strip /usr/sbin/nginx* \t&& strip /usr/lib/nginx/modules/*.so \t&& rm -rf /usr/src/nginx-$NGINX_VERSION \t\t&& apk add --no-cache --virtual .gettext gettext \t&& mv /usr/bin/envsubst /tmp/ \t\t&& runDeps=\"$( \t\tscanelf --needed --nobanner /usr/sbin/nginx /usr/lib/nginx/modules/*.so /tmp/envsubst \t\t\t| awk '{ gsub(/,/, \"\\nso:\", $2); print \"so:\" $2 }' \t\t\t| sort -u \t\t\t| xargs -r apk info --installed \t\t\t| sort -u \t)\" \t&& apk add --no-cache --virtual .nginx-rundeps $runDeps \t&& apk del .build-deps \t&& apk del .gettext \t&& mv /tmp/envsubst /usr/local/bin/ \t\t&& ln -sf /dev/stdout /var/log/nginx/access.log \t&& ln -sf /dev/stderr /var/log/nginx/error.log"
        },
        {
            "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
            "created": "2017-03-03T22:03:00.639871859Z",
            "created_by": "/bin/sh -c #(nop) COPY file:af94db45bb7e4b8ff4e699f1ff6f41c348f9876073ad91d6e803070415f8d9ce in /etc/nginx/nginx.conf "
        },
        {
            "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
            "created": "2017-03-03T22:03:01.176145252Z",
            "created_by": "/bin/sh -c #(nop) COPY file:d15ceb73c6ea776c299822265ed38cd2fd8a78804f4f4889094d1dd1e292984b in /etc/nginx/conf.d/default.conf "
        },
        {
            "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
            "created": "2017-03-03T22:03:01.50316706Z",
            "created_by": "/bin/sh -c #(nop)  EXPOSE 443/tcp 80/tcp",
            "empty_layer": true
        },
        {
            "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
            "created": "2017-03-03T22:03:01.815836512Z",
            "created_by": "/bin/sh -c #(nop)  CMD [\"nginx\" \"-g\" \"daemon off;\"]",
            "empty_layer": true
        }
    ],
    "os": "linux",
    "rootfs": {
        "diff_ids": [
            "sha256:9f8566ee5135862dd980160c27bd7721448a6f7f385bbb81f7f001f1b78a5fbf",
            "sha256:d4930e247b4962e14642f6017cf578fe965514784ca99dc2550373471c45fec8",
            "sha256:c0ab80890b7ffee1f40a8d33e66b5cc9e63e8c10fec1866384d21d4a8529b816",
            "sha256:4a8d9a67e458d2c8fe42c5aa2a2a35303c7484df30207e233fcf03ab7bb9ffec"
        ],
        "type": "layers"
    }
}
```

由此得出如下结论：

```
docker image ls
    ↓
nginx:alpine
    ↓
imageid(0ae090dba3ab)
    ↓ find & cd
image/overlay/imagedb/content/sha256/0ae090dba3ab*
    ↓ cat
rootfs.diff_ids: [
  sha256:9f8566ee5135862dd980160c27bd7721448a6f7f385bbb81f7f001f1b78a5fbf
  sha256:d4930e247b4962e14642f6017cf578fe965514784ca99dc2550373471c45fec8
  sha256:c0ab80890b7ffee1f40a8d33e66b5cc9e63e8c10fec1866384d21d4a8529b816
  sha256:4a8d9a67e458d2c8fe42c5aa2a2a35303c7484df30207e233fcf03ab7bb9ffec
]
    ↓                                       ↓ cd
    ↓                     image/overlay/layerdb/sha256/9f8566ee51*
    ↓                         ↓ ls                          ↓ ls
    ↓                     ./cache-id                     ./diff
    ↓                         ↓ cat & cd                    ↓ cat
    ↓             overlay/94cb6c62c072/root    diffid(sha256:9f8566ee51*)
    ↓
image/overlay/distribution/v2metadata-by-diffid/sha256/9f8566ee51*
    ↓ cat & cd
image/overlay/distribution/diffid-by-digest/sha256/7095154754192bf*
    ↓ cat
diffid(sha256:9f8566ee51*)
```

镜像至此简析完毕。

## 启动第一个容器

首先，我们启动一个容器，在容器内部创建一个文件，然后容器退出等待下一次启动：

```shell
[root@localhost docker]# docker run --name nginx nginx:alpine touch /root/awesome-nginx.txt
```

从 `containers` 目录开始追踪，一路搜寻容器的踪迹：

```shell
[root@localhost docker]# tree containers/
containers/
`-- 6175f77e9d170376e1a11d419774c76213f1ca966a804b12d3995436edb30621
    |-- 6175f77e9d170376e1a11d419774c76213f1ca966a804b12d3995436edb30621-json.log
    |-- checkpoints
    |-- config.v2.json
    |-- hostconfig.json
    |-- hostname
    |-- hosts
    |-- resolv.conf
    |-- resolv.conf.hash
    `-- shm
    
[root@localhost docker]# cat containers/6175f77e9d170376*/config.v2.json | python -m json.tool | grep \"ID\"
    "ID": "6175f77e9d170376e1a11d419774c76213f1ca966a804b12d3995436edb30621",

[root@localhost docker]# find -name 6175f77e9d170* | grep overlay
./image/overlay/layerdb/mounts/6175f77e9d170376e1a11d419774c76213f1ca966a804b12d3995436edb30621

[root@localhost docker]# ll $(find -name 6175f77e9d170* | grep overlay)
total 12
-rw-r--r--. 1 root root 69 Mar 16 14:18 init-id
    # 内容：f9ddcc38d33be0dad43ab740692d3431fcc92d90a97bbc2b22dcdec44bcceacb-init
    # 指向 overlay/f9ddcc38d*-init
-rw-r--r--. 1 root root 64 Mar 16 14:18 mount-id
    # 内容：f9ddcc38d33be0dad43ab740692d3431fcc92d90a97bbc2b22dcdec44bcceacb
    # 指向 overlay/f9ddcc38d*
-rw-r--r--. 1 root root 71 Mar 16 14:18 parent
    # 内容：1da0e48557625a4d36d61f73e19171eafed4d7f983fb0f733598abdb67a05ebf
    # 指向 image/overlay/layerdb/sha256/1da0e48557625*
    # 这个一层层往回指，最终会指向 alpine:3.4 所属的 layerdb 内容，没有 parent 的就是基础镜像
```

镜像至此简析完毕。