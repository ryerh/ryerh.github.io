---
title: 教务系统秒评
date: 2014-12-10 11:16:03 +08:00
categories:
- javascript
layout: post
---

教务评估好麻烦呀，研究了一下，用下面四行代码可以秒评（全好评）。

``` javascript
var inputGroup = document.querySelectorAll('input[type=radio]');
for(var i=0, len=inputGroup.length; i<len; i++)
    if(i % 5 == 0) inputGroup[i].checked = true;
document.StDaForm.submit();
```
