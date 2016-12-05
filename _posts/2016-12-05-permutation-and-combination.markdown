---
title: Permutation & Combination
date: 2016-12-05 11:21:00 Z
layout: post
---

```js
function A(arr) {
  const ret = []
  function walk(coll, path = []) {
    coll.map(c => {
      path.push(c)
      const rest = coll.filter(v => v !== c)
      if (rest.length > 0) {
        walk(rest, path)
      } else {
        ret.push(path.slice().join(','))
      }
      path.pop()
    })
  }
  walk(arr)
  return ret
}

function C(arr, n) {
  const ret = []
  function walk(coll, path = [], depth = n) {
    coll.map(c => {
      path.push(c)
      const rest = coll.filter(v => v !== c)
      if (depth > 1) {
        walk(rest, path, depth - 1)
      } else {
        ret.push(path.slice())
      }
      path.pop()
    })
  }
  walk(arr)
  return ret
}

const r = A([1, 2, 3, 4], 2)
console.log(r)
```