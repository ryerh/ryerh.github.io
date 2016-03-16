---
layout: post
title:  "Webpack 打包 Vue 时 Sass import 重复引入的问题"
date:   2016-03-15 15:08:26 +0800
categories: javascript
---

使用 `vue-cli` 执行 `vue init webpack vue-project` 创建一个 `Vue` 项目，
如果使用了 `<style lang="scss">`，
并在很多组件的 `<style>` 标签内都 `@imoprt` 同一个 `Sass` 文件，
就会导致打包出来的 `CSS` 文件很大，因为所有引入的 `Sass` 文件都被重复打包了。

`vue-loader` 作者在 `issues` 里回答了这个问题，
[Duplicate import problem with sass](https://github.com/vuejs/vue-loader/issues/110)。

我试图使用 `webpack` 的 `CommonsChunkPlugin` 插件抽离出公共的 `CSS` 部分，
作为 `vendor.[hash].css` 用来全局共享，但是效果不尽人意，
因为 `vue-loder` 是以组件为基本单位解析 `<style lang="scss">` 标签的，
如果 `index.vue` 组件引入了 `base.scss`，
并且 `index.vue` 的子组件也引入了 `base.scss`，
那么 `base.scss` 就会被包含两次输出到最终的 `css` 文件里。

解决方法是，不要重复引用 `scss` 文件，
如果要重复引用，也只引用抽象的 `scss` 文件，
比如 `functions.scss`、`variable.scss`、`minxinx.scss` 这些不会污染输出的 `scss` 文件。

或者参考作者在 `issue` 里的解决方案，用 `cssnano` 把 `css` 中重复的规则去掉。
