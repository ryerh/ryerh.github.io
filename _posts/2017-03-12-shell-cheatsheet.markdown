---
title: Shell Cheatsheet
date: 2017-03-12 13:52:00 +08:00
layout: post
---

# 变量

## 变量定义

```shell
var="hello"
echo $var ${var}-name
```

## 位置参数

param      | desc
-----------|-----
$0         | script file
$1 .. $n   | script params
$#         | param count
$@ $*      | all params
$?         | most recent ret code
$!         | most recent background job pid

## `$@` vs `$*`

```shell
# script.sh
function main() {
   echo 'I got ' $# ' args'
}
main $*
main $@
main "$*"
main "$@"

# output
$ sh script.sh 'a b c' d e
I got 5 args
I got 5 args
I got 1 args
I got 3 args
```

# 条件控制

## 注意项
- `[ -z "" ]` 前后都有空格
- `[ "1" \> "" ]` 因为 `[` 是命令，后面跟着的都是它的参数，所以不要少加空格，且为了防止 `>` 被解析为重定向符号要转义
- `[[ "1" > "" ]]` 因为 `[[ ]]` 是 bash 的语法结构，所以不需要转义

## 逻辑测试
param      | desc
-----------|-----
(e)        | ([ -n "hello" ])
not e      | [ ! -n "hello" ] 等价于 ! [ -n "" ]
e1 and e2  | [ -n "" -a -n "" ] 等价于 [ -n "" ] && [ -n "" ]
e1 or e2   | [ -n "" -o -n "" ] 等价于 [ -n "" ] || [ -n "" ]

## 文件测试
param      | desc
-----------|-----
-d FILE    | is directory
-f FILE    | is file
-e FILE    | file or dir exists
-x FILE    | excutable
f1 -nt f2  | f1 newer then f2
f1 -ot f2  | f1 older then f2
...        | man test

## 字符串测试
param      | desc
-----------|-----
-z str     | len(str) == 0
-n str     | len(str) > 0
s1 = s2    | s1 == s2
s1 != s2   | s1 != s2
s1 > s2    | s1 > s2
!(s1 < s2) | s1 >= s2
s1 < s2    | s1 < s2
!(s1 > s2) | s1 <= s2
...        | man test

## 数字测试
param      | desc
-----------|-----
n1 -eq n2  | algebraically ==
n1 -ne n2  | algebraically !=
n1 -gt n2  | algebraically >
n1 -ge n2  | algebraically >=
n1 -lt n2  | algebraically <
n1 -le n2  | algebraically <=
...        | man test

## 直接测试

```shell
$ test expression && echo yes
$ [ expression ] && echo yes
$ [[ expression ]] && echo yes
```

## 条件判断

```shell
if [[ expression ]]; then
  # ...
elif [[ expression ]]; then
  # ...
else
  # ...
fi
```

## 条件选择

```shell
case VAR in
  var1) cmd1 ;;
  var2) cmd2 ;;
  # ...
  *) cmd ;;
esac
```

# 循环控制

## for

```shell
for var in (list); do
  # ...
  break
  continue
done

for ((i=1, j=10; i <= 10; i++, j--)); do
  # ...
done
```

## while

```shell
while ((1)); do
  # ...
  break
  continue
done

while true; do
  # ...
done
```

## until

```shell
until [[ -n "" ]]; do
  # ...
  break
  continue
done
```

select DAY in Mon Tue Wed Thu Fri Sat Sun; do
  case $DAY in
    Mon) echo "Today is Monday" ;;
    Tue) echo "Today is Tuesday" ;;
    # ...
    *) echo "Unkown day, stop" && break ;;
  esac
done
```

# 函数

```shell
function foo() {
  local var=0
  return $var
} 
```