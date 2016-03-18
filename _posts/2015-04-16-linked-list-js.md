---
layout: post
title:  "双链表的 JavaScript 实现"
date:   2015-04-16 16:04:54 +0800
categories: data-structure
---

请不要问我这有毛用，因为根本毛用都没有。

没有错误处理

封装有点问题

无继承

Just for fun :-P

{% highlight javascript linenos %}

/**
 * Created by ryer on 15/4/15.
 */

// 双链表的 JavaScript 实现
(function(global) {
    var head = new Node(void 0, null, null),
        tail = new Node(void 0, null, null),
        theSize = 0;

    // 定义节点
    function Node(data, prev, next) {
        var self = this,
            args = arguments;
        ['data', 'prev', 'next'].forEach(function(e, i) { self[e] = args[i]; });
    }

    // 定义迭代器
    function Iterator(node) {
        this.curNode = node instanceof Node ? node : new Node(void 0, null, null);
    };
    Iterator.prototype = {
        value: function() { return this.curNode.data; },
        prev: function() { this.curNode = this.curNode.prev; return this; },
        next: function() { this.curNode = this.curNode.next; return this; },
        equals: function(rhs) { return this.curNode === rhs.curNode; }
    };

    // 定义链表
    function List() {
        // 初始化头尾节点
        head.next = tail;
        tail.prev = head;
    }
    List.prototype = {
        begin: function() { return new Iterator(head.next); },
        end: function() { return new Iterator(tail); },
        length: function() { return theSize; },
        insert: function(itor, value) {
            var p = itor.curNode,
                newNode = new Node(value, p.prev, p);
            theSize++;
            return new Iterator(p.prev = p.prev.next = newNode);
        }, erase: function(itor) {
            var p = itor.curNode,
                retValue = itor.value();
            p.prev.next = p.next;
            p.next.prev = p.prev;
            theSize--;
            return retValue;
        }
    };

    // 插入到全局对象中
    global.List = List;
})(this);

// 测试双链表

// 创建
var list = new List();
// 插值
for(var i = 0; i &lt; 5; i++) {
    list.insert(list.begin(), i);
}
// 读值
for(var itor = list.begin(); !itor.equals(list.end()); itor = itor.next()) {
    console.log(itor.value());
}

{% endhighlight %}
