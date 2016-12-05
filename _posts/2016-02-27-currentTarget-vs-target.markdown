---
title: currentTarget vs target
date: 2016-02-27 20:14:30 +08:00
categories:
- javascript
layout: post
---

`currentTarget` 获取监听事件的元素

`target` 获取触发事件的元素

``` html
<div id="outer">
    点击此处 console 输出 outer outer
    <h1 id="inner">点击此处 console 输出 inner outer</h1>
</div>

<script>
    const $outer = document.querySelector('#outer');
    const onClickOuter = e => console.log(e.target.id, e.currentTarget.id);
    $outer.addEventListener('click', onClickOuter);
</script>
```
