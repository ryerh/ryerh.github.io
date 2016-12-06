---
title: 终章 — createStore
date: 2016-08-28 19:01:00 +08:00
layout: post
---

## 伪代码

```python
def createStore(reducer, preloadedState, enhancer)
  return enhancer(createStore)(reducer, preloadedState) if enhancer.isFunction
  error('...') if reducer.isNotFunction
 
  currentReducer = reducer
  currentState = preloadedState
  currentListeners = []
  nextListeners = currentListeners
  isDispatching = false
 
 
  def getState()
    return currentState
 
  def dispatch(action)
    error('...') if action.isNotPlainObject
    error('...') if action.type.isUndefined
    error('...') if isDispatching
 
    isDispatching = true
    currentState = currentReducer(currentState, action)
    isDispatching = true
 
    currentListeners = nextListeners
    each (listener) in currentListeners
      listener()
    return action
 
  def replaceReducer(nextReducer)
    error('...') if nextReducer.isNotFunction
    currentReducer = nextReducer
    dispatch({ type: '@@redux/INIT' })
 
  def subscribe(listener) {
    error('...') if listener.isNotFunction
    isSubscribed = true
    nextListeners = currentReducer.copy.push(listener)
    return def unsubscribe() {
      return if isSubscribed.isFalse
      isSubscribed = false
      nextListeners = currentReducer.copy.findAndRemove(listener)
 
  def observable() {
    outerSubscribe = subscribe
    return {
      def subscribe(observer)
        error('...') if observer.isNotObject
 
        def observeState()
          observer.next(getState) if observer.next.isFunction
 
        observeState()
        unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
 
      def [$$observable]()
        return this
    }
 
  dispatch({ type: '@@redux/INIT' })
  return {
    getState,
    dispatch,
    replaceReducer,
    subscribe,
    [$$observable]: observable
  }
```

## 解读

有件有意思的事情，这里定义的 createStore 并没有创建 store 实例，而是转交给 enhancer（也就是中间件处理系统），让 enhancer 调用自己创建出 store（有点递归的意思）。所以过程为 createStore -> enhancer -> enhancedCreateStore -> store。
接下来是 createStore 的主体部分，定义了 store.prototype 上的五个方法，下面一一介绍：
1）getState：直接返回整个应用的状态。
2）dispatch：把 action 丢给根 reducer 处理，顺便通知一下所有的 listener。
3）replaceReducer：用一个新的根 reducer 替换原先的 reducer，这个在开发模式下启用了 HMR（热替换）的时候很有用。
4）subscribe：添加 listener，返回值是该 listener 的 unsubscribe 方法。
5）observable：如果要理解这个 observable 的作用，就又要牵扯出当前前端的另一种异步控制流解决方案了，RxJS。在给 redux 开发异步 middleware 的时候，它会起到作用。这部分需要结合应用场景去理解，并结合优秀的 middleware 实现去分析。
最后在 createStore 的末尾，dispatch 了一次初始化 action。
 
『总结』
这里比较有意思的是 createStore 跟 enhancer 相互配合生成 store 示例的过程，一个互相调用的小嵌套，激情四射。

## 源码

```js
import isPlainObject from 'lodash/isPlainObject'
import $$observable from 'symbol-observable'
/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
export var ActionTypes = {
  INIT: '@@redux/INIT'
}
/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    return enhancer(createStore)(reducer, preloadedState)
  }
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }
  var currentReducer = reducer
  var currentState = preloadedState
  var currentListeners = []
  var nextListeners = currentListeners
  var isDispatching = false
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }
    var isSubscribed = true
    ensureCanMutateNextListeners()
    nextListeners.push(listener)
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }
      isSubscribed = false
      ensureCanMutateNextListeners()
      var index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    var listeners = currentListeners = nextListeners
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]()
    }
    return action
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.')
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }
        observeState()
        var unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },
      [$$observable]() {
        return this
      }
    }
  }
  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT })
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```