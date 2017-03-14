---
title: DomEl.(client/offset/scroll)Width
date: 2017-03-14 10:43:00 +08:00
layout: post
---

Short answer:

- `clientWidth` is the inner width (ie. the space inside an element including padding but excluding borders and scrollbars)
- `offsetWidth` is the outer width (ie. the space occupied by the element, including padding and borders)
- `scrollWidth` is the total width including stuff that is only visible if you scroll

Taken from [clientWidth vs offsetWidth vs scrollWidth](https://wincent.com/wiki/clientWidth_vs_offsetWidth_vs_scrollWidth)