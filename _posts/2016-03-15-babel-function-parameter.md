---
layout: post
title:  "Babel 参数默认值转换 bug"
date:   2016-03-15 15:08:26 +0800
categories: javascript
---


`.babelrc` 参数

{% highlight javascript %}
{
    presets: ['es2015', 'es2015-loose', 'stage-2'],
    plugins: ['transform-runtime'],
    comments: false
}
{% endhighlight %}


input source code

{% highlight javascript %}
let foo = 'outer';
function bar(func = x => foo) {
    let foo = 'inner';
    console.log(func()); // outer
}
bar();
{% endhighlight %}


Expected output:

{% highlight javascript %}
'use strict';

var foo = 'outer';
var f = function(x) { return foo; };
function bar() {
    var func = arguments.length <= 0 || arguments[0] === undefined ? f : arguments[0];

    var foo = 'inner';
    console.log(func()); // I should get 'outer' here
}
bar();
{% endhighlight %}


Actual output:

{% highlight javascript %}
'use strict';

var foo = 'outer';
function bar() {
    var func = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return foo;
    } : arguments[0];

    var foo = 'inner';
    console.log(func()); // however, I got an 'inner'
}
bar();
{% endhighlight %}

我提交的 bug report
[The scope of function parameter's default values is wrong.](https://phabricator.babeljs.io/T7204)
