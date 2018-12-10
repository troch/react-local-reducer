# react-local-reducer

[![Build Status](https://travis-ci.org/troch/react-local-reducer.svg?branch=master)](https://travis-ci.org/troch/react-local-reducer)
[![npm version](https://badge.fury.io/js/react-local-reducer.svg)](https://badge.fury.io/js/react-local-reducer)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> A tiny library (~1k gzipped) to use redux-style reducers locally in your React components. No external dependency, it can be used with or without a redux store.

```sh
npm install --save react-local-reducer
# or
yarn add react-local-reducer
```

For using hooks, see [react-hooked-reducer](troch/react-hooked-reducer).

## Why?

As you scale your Redux application, your store will grow. Over time, as you add more and more reducers to the store, performance will decrease and bundle size will increase.

With `react-local-reducer`, you can split your store into smaller chunks, and isolate their performance impact. Each chunk is located within the section of your app which depends on it - perfect for code-splitting.

## Tell Me More

One root cause of some of the problems associated with a large Redux store is that reducers need to be imported at store creation. This means they cannot be code-split in vanilla Redux, and while there are solutions which allow you to add or remove reducers dynamically, these solutions have trade-offs.

__Scaling a redux application__ means adding more and more reducers to your global store, most of which will end up being irrelevant to the components which are mounted at any given time. Reducers are a bit like __singletons__, and complexity is added when they relate to a specific component (which isn't a singleton):
- You end up having to manage __initialisation or reset actions__
- Having multiple instances of a same component adds the overhead __add and remove actions__, forces you to __identify the origin of an action__ and to add more logic in your reducer.

Another issue is that all reducers are called with every action dispatched to the store. If you have a huge number of reducers, this means each action will trigger a huge number of reducers - even the ones which are irrelevant to that action.

Not everything needs to be in a global store, especially state which is __not shared across your application, and which strongly relates to a single component__. When a reducer is coupled to a component, it can consume global state and global actions, but its state and actions no longer weigh down the store. Emerging architectures like Apollo Client consist of a redux store to cache network data (entities), with the rest of your state managed locally.

## React local reducers

- This library offers a similar solution in React alone: local state which __colocates reducers with their components__
- Reducers are created using `props` and `context` so they can be initialised, and they __must return an object__
- Reducers __can receive actions from your main store__, with the help of a store enhancer provided with this package

#### __withReducer(reducerCreator, mapDispatchToProps, mergeProps?)(BaseComponent)__

`withReducer` is a higher-order component which adds a reducer to a component. Its API is similar to `connect`, with `mapStateToProps` being replaced by a reducer. By default, it will spread the output of its reducer to props, alongside action creators bound to your Redux store. Selectors are not necessary.

```js
import React from 'react'
import { withReducer } from 'react-local-reducer'

// Reducer
const reducerFactory = ({ initialCount }) =>
  (state = { count: initialCount }, action) => {
    if (!action) return state

    if (action.type === 'ADD') {
      return ({
        count: state.count + 1
      })
    }

    if (action.type === 'REMOVE') {
      return ({
        count: state.count - 1
      })
    }

    return state
  }

// Action creators
const add = () => ({ type: 'ADD' })
const remove = () => ({ type: 'REMOVE' })

// Component
const Counter = ({ count, add, remove }) => (
  <div>
    Count: { count }
    <button onClick={ add }>Plus</button>
    <button onClick={ remove }>Remove</button>
  </div>
)

export default withReducer(
  reducerFactory,
  { add, remove }
)(Counter)
```

The above created component would be used as follow:

```js
<Counter initialCount={ 10 } />
```

One benefit of this approach is that you can have as many counters as you want, without adding complexity to your store.


###### __mergeProps__

You can customise how `props`, `state` and `actionCreators` are passed through to your base component by adding a `mergeProps` function.

This function has the signature `(props, state, actionCreators) => ({ /* ... */ })`, and the returned object will be passed to the base component as props.

For example, if you wish to pass your `state` as a single object:

`(props, state, actionCreators) => ({ ...props, state, ...actionCreators })`

Or if you wish for the separate props to be available in addition to being combined as a single object:

`(props, state, actionCreators) => ({ ...props, state, ...state, ...actionCreators })`

By default, `props`, `state` and `actionCreators` are simply merged together.


#### __setContextType__

You can pass your `store` and other dependencies using `setContextType(context: ReactContext)`.

```js
import { setContextType } from 'react-local-reducer'

setContextType(DependencyContext)
```

Don't forget to set its value with a its provider. When using `withReducer`, you need to define a reducer creator (factory).

```js
const reducerCreator = (props, context) => { /* return reducer */ }
```


#### __onDispatchStoreEnhancer__

You can have your local reducers receive any action your global redux store receives. Simply use the redux store enhancer `onDispatchStoreEnhancer`.

```js
import { createStore } from 'redux'
import { onDispatchStoreEnhancer } from 'react-local-reducer'

const store = createStore(reducer, initialState, onDispatchStoreEnhancer)
```

For composing multiple store enhancers, look at: http://redux.js.org/docs/api/compose.html
