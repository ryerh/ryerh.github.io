---
layout: post
title:  "WordPress 加速"
date:   2014-12-07 05:11 +0800
categories: wordpress
---

因为Google被墙，Gravatar的CDN连接不上，致使国内所有的WordPress博客都受到了影响。
Google的字体可以用360的前端公用库完美替换，而Gravatar就没这么幸运了。
我目前图省事儿直接改 'get_avatar' 这个 hook，返回一个空字符串，
这样就不会加载头像了(听说https依旧可用，待尝试)。
需要用头像的地方，可以用本地替换的方法。
主题和插件等等都会使用大量的Google资源，
打开浏览器的开发者工具(F12)，切换到网络选项卡。
刷新博客，查出来无法加载的资源，想办法禁用或替换掉就可以了。
然后配合WP缓存插件，速度会有质的飞跃。
除此以外，WordPress本身效率低的诟病已被众多WP用户黑到不行了，
只能从PHP本身下手，我开启了PHP 5.5自带的OPcache加速器。

总结如下：

1. 优化前端页面
    1. 减少请求次数
    2. 合并CSS、JS、图片
    3. 能不用图片的地方，就不要用图片
        1. 图形用CSS3代替
        2. 图标用WP自带的Dashicons
        3. 背景图裁切合适大小并适当压缩
2. 禁用Gravatar头像
3. 用360字体库替换Google字体库
4. 使用WordPress Super Cache缓存插件
5. PHP 5.5以上，在php.ini中开启OPcache
6. 其他你愿意折腾的优化方式

``` javascript
/**
 * 方案一：直接禁用Google字体
 * 分别在前台、后台、登陆界面移除Google字体的CSS
 * add_action( 'wp_enqueue_scripts', theme_remove_wp_open_sans' );
 * add_action( 'admin_enqueue_scripts', theme_remove_wp_open_sans' );
 * add_action( 'login_enqueue_scripts', theme_remove_wp_open_sans' );
 */
function theme_remove_wp_open_sans() {
    wp_deregister_style( 'open-sans' );
    wp_register_style( 'open-sans', false );
}

/**
 * 方案二：用360字体库替换Google字体库
 * 360通过代理连接Google字体服务，然后转换链接供国内使用
 * 首先通过查找替换将主题文件中的 'googleapis' 全部替换为 'useso'
 */
add_filter( 'style_loader_tag', 'theme_replace_wp_open_sans', 10, 1 );
function theme_replace_wp_open_sans($text) {
    return str_replace( '//fonts.googleapis.com/', '//fonts.useso.com/', $text );
}

// 删除Gravatar头像
add_filter('get_avatar', 'theme_disable_gravatar', 10, 5);
function theme_disable_gravatar( $avatar, $id_or_email, $size, $default, $alt ) {
    return '<span></span>';
}

/**
 * 缓存PHP opcode
 * PHP 5.5及以上版本自带一个OPcache拓展，打开php.ini，填入以下配置重启Apache即可。
 * PHP 5.5以下版本可以使用APC、eAccelerator、XCache代替，但都不如OPcache效果理想，方法百度。
 * 如果开启了xdebug拓展，请让OPcache在Xdebug之前开启。
 */
[opcache]
zend_extension=php_opcache.dll
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
opcache.fast_shutdown=1
opcache.enable_cli=1
```
