---
title: 中间件的侵入 — compose & applyMiddleware
date: 2016-08-28 18:59:00 +08:00
layout: post
---

## 伪代码

```python
def compose(...funcs)
  return (arg) => arg if funcs.length.is.0
  return funcs[0] if funcs.length.is.1
 
  rest, lastOne = funcs.split
  return (...args) => rest.foldR((composed, f) => f(composed), lastOne(...args))
 
 
def applyMiddleware(...middlewares) -> Function
  return def enhanceCreator(createStore) -> Function
    return def enhancedCreator(reducer, preloadedState, enhancer) -> PlainObject
      store = createStore(reducer, preloadedState, enhancer)
      dispatch = store.dispatch
      chain = []
      middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => next(action)
      }
      chain = map (middleware) in middlewares
        return middleware(middlewareAPI)
      dispatch = compose(...chain)(store.dispatch)
      return {
        ...store,
        dispatch
      }
```

## 解读

先看 compose 函数：
这就是一个单纯的实现函数组合的 FP 函数，函数组合的数学定义为(f·g·h)(x) = f(g(h(x)))，调用 compose(f, g, h) 的返回值等价于 (...args) => f(g(h(...args)))。
采用 foldR 是因为 foldR 与数学定义上的结合顺序是一致的，而通常大家喜欢用 foldL 只是因为人习惯从左往右阅读而已。
Redux 为了不再引入第三方库就直接集成了这个函数，否则调用 lodash.flowRight 也可以实现。不过这不是重点，下面要介绍的 applyMiddleware 函数才是重头戏。
 
再看 applyMiddleware 函数：
想要执行 applyMiddleware，先要了解 middleware 的形式，其形式为 middleware :: (store) => (next) => (action) => next(action)。
在看 applyMiddleware 的形式，其形式为 applyMiddleware :: (...middlewares) => (createStore) => (reducer, preloadedState, enhancer) => store。
首先能粗略看出的信息就是它俩都是高阶函数的典型用法，大量采用高阶函数是为了避免 monkey patch，这种中间件的设计模式应该是从 TJ 大神的 connect（express 的中间件系统，源码也比较短，我暂时还没读）那里学到的，而 TJ 又是从别的地方受到的启发。如果对 FP 范式的理解还不错的话，直接看伪代码应该就能理解 applyMiddleware 的工作机制。如果想要详细从零理解 applyMiddleware 函数，可以查看 Redux 官方文档：Advanced > Middleware，我很难讲解得比它更浅显易懂了，非常推荐阅读（补充，我还是厚着脸皮翻译并简化了一遍，请戳本系列左侧目录树“外传”）。
 
『总结』
调用 applyMiddleware 会得到一个加强版的 createStore，它先通过原始的 createStore 创建一个 store 对象，然后将 middlewares 注入到 store.dispatch() 中改变它的原有行为。

## 源码

```js
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}
 
 
/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer)
    var dispatch = store.dispatch
    var chain = []
    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}
```