---
title: Redux 源码 - 根 Reducer 的创建
date: 2016-08-28 18:57:00 +08:00
layout: post
---

## 伪代码

```python
def combineReducers(reducers) -> Function
  finalReducers = filter (k, reducer) in reducers
    warn('...') if reducer.isUndefined
    return reducer.isFunction
  each (k, reducer) in finalReducers
    error('...') if reducer(undefined, {type: '@@redux/INIT'}).is.undefined
    error('...') if reducer(undefined, {type: '@@redux/PROBE_UNKNOWN_ACTION_随机字串'}).is.undefined
  return def combination(state = {}, action) -> PlainObject
    hasChanged = false
    nextState = map (k, reducer) in finalReducers
      error('...') if check(state, finalReducers, action).fail
      prevKeyState = state[k]
      nextKeyState = reducer(prevState, action)
      error('...') if nextKeyState.isUndefined
      hasChanged = true if nextKeyState.notEquals.prevKeyState
    return hasChanged ? nextState : state
```

## 解读

输入一个 reducers 对象，把它们合并成一个 reducer 函数，总共有三个阶段：
1）首先处理一下输入参数：过滤一遍全体 reducers，忽略不是函数的 reducer（通常是写错了），并警告 key 对应值是空的 reducer（错得更离谱）。
 
2）然后就是预执行两次全体 reducers（后面讲解 createStore 的时候会发现其实还发生了第三次）：第一次的目的是让所有的 reducer 都初始化它们的 initialState。第二次的目的是探测一下 reducers 们初始化完成后，遇到莫名的 action 能不能正常处理。
Redux 作者解释了非要你执行两次的原因：当你写的 reducer 接收到一个莫名的 action 时，如果 reducer 还没有初始化就返回 initial state（对应第一次），如果 reducer 已经初始化了就返回 current state（对应第二次），而返回 undefined 纯属找骂。

3）创建根 reducer，也就是伪代码中的 combination 函数：
根 reducer 接受整个应用的 state，返回的也是整个应用的 state。当根 reducer 收到一个 action 后，它无需判断这个 action  应该丢给哪一个具体的子 reducer 处理，直接遍历所有子 reducer 然后把收到的 action 丢给孩子们统统执行一遍。
这就解释了为什么多个 reducer 可以处理同一个 action，也就意味着 reducer 们被定义的顺序不是没有意义的，它们处理同一个 action 的时机肯定不一样（因为 reducer 都是阻塞执行的）。
如果所有的子 reducer 都没有处理你丢给 redux 的 action，根 reducer 会扔给你原来的根 state，否则就扔给你一个全新的 state。由源码可以看出，根 reducer 内部维护的这个根 state 用的就是一个原始的 plain object，没有用到 immutable 数据结构。后面会介绍 redux 怎么处理它的 listeners 们，属于同样简单直接的处理方式。

『总结』
reducer 的维护机制建明直白，一点复杂的逻辑和 trick 都没有。

## 源码

```js
import { ActionTypes } from './createStore'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'
function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type
  var actionName = actionType && `"${actionType.toString()}"` || 'an action'
  return (
    `Given action ${actionName}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state.`
  )
}
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers)
  var argumentName = action && action.type === ActionTypes.INIT ?
    'preloadedState argument passed to createStore' :
    'previous state received by the reducer'
  if (reducerKeys.length === 0) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed ' +
      'to combineReducers is an object whose values are reducers.'
    )
  }
  if (!isPlainObject(inputState)) {
    return (
      `The ${argumentName} has unexpected type of "` +
      ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
      `". Expected argument to be an object with the following ` +
      `keys: "${reducerKeys.join('", "')}"`
    )
  }
  var unexpectedKeys = Object.keys(inputState).filter(key =>
    !reducers.hasOwnProperty(key) &&
    !unexpectedKeyCache[key]
  )
  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true
  })
  if (unexpectedKeys.length > 0) {
    return (
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    )
  }
}
function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(key => {
    var reducer = reducers[key]
    var initialState = reducer(undefined, { type: ActionTypes.INIT })
    if (typeof initialState === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
        `If the state passed to the reducer is undefined, you must ` +
        `explicitly return the initial state. The initial state may ` +
        `not be undefined.`
      )
    }
    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.')
    if (typeof reducer(undefined, { type }) === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
        `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
        `namespace. They are considered private. Instead, you must return the ` +
        `current state for any unknown actions, unless it is undefined, ` +
        `in which case you must return the initial state, regardless of the ` +
        `action type. The initial state may not be undefined.`
      )
    }
  })
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
export default function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers)
  var finalReducers = {}
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  var finalReducerKeys = Object.keys(finalReducers)
  if (process.env.NODE_ENV !== 'production') {
    var unexpectedKeyCache = {}
  }
  var sanityError
  try {
    assertReducerSanity(finalReducers)
  } catch (e) {
    sanityError = e
  }
  return function combination(state = {}, action) {
    if (sanityError) {
      throw sanityError
    }
    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache)
      if (warningMessage) {
        warning(warningMessage)
      }
    }
    var hasChanged = false
    var nextState = {}
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i]
      var reducer = finalReducers[key]
      var previousStateForKey = state[key]
      var nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}
```