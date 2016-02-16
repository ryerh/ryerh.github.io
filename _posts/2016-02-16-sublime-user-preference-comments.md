---
layout: post
title:  "如何保留 Sublime Text 配置文件的注释"
date:   2016-02-16 13:11:47 +0800
categories: sublime-text
tags: ediotr
---

Sublime Text 编辑器的用户配置文件 `preferences.sublime-settings`，会因为 JSON 排序而丢失所有的注释。

因为在 JSON 的标准中，并没有关于注释的实现内容，因此各个 JSON 解析器自然也是不包含注释节点的解析的。

于是目前，包括我自己，采用的最简单的方法就是直接把 JSON 文件中的注释都用正则过滤掉，然后再 parse JSON。

然而 Sublime Text 那么多的配置选项，没有合理的注释让我十分苦恼。

国外有位小伙伴机智地解决了问题(虽然很不雅)：

{% highlight json %}
{
    "auto_complete": true,
    "auto_complete_": "注释：开启自动补全",

    "auto_complete_commit_on_tab": true,
    "auto_complete_commit_on_tab_": "注释：开启 Tab 键自动补全",
}
{% endhighlight %}

参考链接：

* [A Sublime Tip](http://spacerobots.net/post/30528696290/a-sublime-tip)