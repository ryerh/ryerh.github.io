---
layout: post
title:  "JavaScript 与 iOS 通过 WebView Bridge 通信"
date:   2016-01-16 18:34:48 +0800
categories: jsbridge
---

### WebViewJavaScriptBridge

[github repo](https://github.com/marcuswestin/WebViewJavascriptBridge)

[http://marcuswest.in/](http://marcuswest.in/)

{% highlight javascript %}
!function(callback) {
    // jQuery ready
    $(function() {
        if(window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback(WebViewJavascriptBridge);
            }, false);
        }
    });
}(function(bridge) {
    // 监听来自 iOS 的消息
    bridge.init(function(msg, responseCallback) {
        // 收到 iOS 发来的消息，并回复 iOS
        if(responseCallback) {
            alert('收到 OC 消息：' + msg + '，请求 JS 回复。');
            responseCallback('JS 给 OC 的回复：Hello, World!');

        // 收到 iOS 发来的消息，无需回复
        } else {
            alert('收到 OC 消息：' + msg + '，无需 JS 回复。');
        }
    });

    // 向 iOS 发送消息，无需回复
    $('#send').on('click', function(e) {
        bridge.send('JS 发消息，无需 OC 回复。');
    });

    // 向 iOS 发送消息，等待回复
    $('#send_reply').on('click', function(e) {
        bridge.send('JS 发消息，请求 OC 回复。', function(res) {
            alert('OC 给 JS 的回复：' + res);
        });
    });
});
{% endhighlight %}
