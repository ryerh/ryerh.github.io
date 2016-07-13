---
layout: post
title:  "npm killed 原因"
date:   2016-07-13 10:57:05 +0800
categories: npm
---

执行 `npm install` 的时候，一直到中途就崩溃，提示：

```bash
[root@localhost ~]# npm i
npm WARN deprecated jade@1.11.0: Jade has been renamed to pug, please install the latest version of pug instead of jade
npm WARN deprecated transformers@2.1.0: Deprecated, use jstransformer
npm WARN deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
Killed ............] - fetchMetadata: sill mapToRegistry uri https://registry.npmjs.org/color
```

用 `dmesg` 查一下内存日志：

```bash
[root@localhost sales]# dmesg
[1982048.529636] Out of memory in UB 317592: OOM killed process 2946 (npm) score 0 vm:1506164kB, rss:237752kB, swap:120052kB
[1982101.466212] Out of memory in UB 317592: OOM killed process 2955 (npm) score 0 vm:1510820kB, rss:244616kB, swap:111180kB
[1982670.001513] Out of memory in UB 317592: OOM killed process 2969 (npm) score 0 vm:1513152kB, rss:242772kB, swap:114732kB
[1982880.314016] Out of memory in UB 317592: OOM killed process 2996 (npm) score 0 vm:1511916kB, rss:245824kB, swap:111788kB
```

内存溢出了，没办法，vps 买的是最低配版。
