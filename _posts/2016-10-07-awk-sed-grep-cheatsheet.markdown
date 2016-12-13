---
title: awk-sed-grep cheatsheet
date: 2016-10-07 22:07:00 +08:00
layout: post
---

## Linux 下进行字符串操作最常用的三个命令：
1. `awk` (检索)
2. `sed` (编辑)
3. `grep` (匹配)

## awk
语法：
``` shell
$ awk [-F fs] [-v var=value] [-f progfile | 'prog'] [file ...]
```

代码结构：
``` shell
BEGIN { FS=":"; RS=";" } # 可选
{ print 'Processing: ' $1 } # 必选
END { print 'End: ' } # 可选
```

设置变量：
``` shell
$ awk -v a='hello' -v b='world' 'BEGIN {print a ", " b}'
hello, world
```

指定字段分隔符：
``` shell
$ echo "1:2:3" | awk -F: '{ print $1 "-" $2 "-" $3 }'
$ echo "1:2:3" | awk -v FS=':' '{ print $1 "-" $2 "-" $3 }'
$ echo "1:2:3" | awk 'BEGIN { FS=":" } { print $1 "-" $2 "-" $3 }'
1-2-3
```

指定过滤条件：
``` shell
# 行匹配(/reg/)
$ awk -F: '/^r/ {print $0}' /etc/passwd
# 列匹配($k ~ /reg/)
$ awk -F: '$1 ~ /^r/ {print $0}' /etc/passwd
```

输出控制：
``` shell
# 所有列
$ awk -F: '/^r/ {print $0}' /etc/passwd
# 第 k 列
$ awk -F: '/^r/ {print $1}' /etc/passwd
# 最后一列
$ awk -F: '/^r/ {print $NF}' /etc/passwd
# 倒数第 k 列
$ awk -F: '/^r/ {print $(NF-1)}' /etc/passwd
# 编号
$ awk -F: '/^r/ {print FNR $0}' /etc/passwd
```

## sed
语法：
``` shell
$ sed [-nefi] '[begin , end] s/regex/complex/'
```

替换：
``` shell
# 每行第一次匹配
$ sed 's/r/R/' /etc/passwd
# 每行所有匹配
$ sed 's/r/R/g' /etc/passwd
# 多组替换
$ sed 's/r/R/; s/o/O/' /etc/passwd
$ sed -e 's/r/R/' -e 's/o/O/' /etc/passwd
```

插入：
``` shell
$ sed '1a BOF' file.txt
$ sed '$a EOF' file.txt
```

删除：
``` shell
$ sed '5, $d' /etc/passwd
$ sed '/^root/d' /etc/passwd
```

输出控制：
``` shell
# 输出第 5 - 10 行
$ sed '5, 10' /etc/passwd
# 输出第 5 - EOF 行
$ sed '5, $' /etc/passwd
# 只显示被编辑的行
$ sed -n 's/r/R/p' /etc/passwd
```

 直接修改文件：
``` shell
$ sed -i 's/hello/HELLO/' hello.txt
```

<h2 id="grep">grep</h2>
语法：
``` shell
$ grep 'pattern' [file ...]
```

## 综上
查找文件内容：
``` shell
$ awk '/^root/ {print $0}' /etc/passwd # $0 或 {...} 都可以省略
$ sed -n '/^root/p' /etc/passwd
$ grep '^root' /etc/passwd
```

提取 IP 地址：
``` shell
$ ifconfig en0 | awk '/inet / {print $2}'
```