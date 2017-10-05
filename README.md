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

### Why?

__Scaling a redux application__ means adding more and more reducers to your global store, most of which will end up not being concerned by what components are mounted. It has an impact on __performance__ and __bundle size__: reducers cannot be code split as they need to be imported at store creation.

There are existing solutions to add and remove reducers dynamically, but they still have trade-offs. Particularly, reducers are a bit like __singletons__, and complexity is added when they relate to a specific component (which isn't a singleton):
- You end up having to manage __initialisation or reset actions__
- Having multiple instances of a same component adds the overhead __add and remove actions__, forces you to __identify the origin of an action__ and to add more logic in your reducer.

Not everything needs to be in a global store, especially state which is __not shared across your application and strongly relates to a component__. When a reducer is coupled to a component, it often consume global state and global actions, but its state and actions are not shared. Emerging architectures like Apollo Client consist of a redux store to cache network data (entities), with the rest of your state managed locally.

### React local reducers

- This solution is a local state solution, and __colocates reducers with their components__
- Reducers are created using `props` and `context` so they can be initialised, and they __must return an object__
- Reducers __can receive actions from your main store__, with the help of a store enhancer provided with this package

#### __withReducer(reducerCreator, mapDispatchToProps)(BaseComponent)__

`withReducer` is a higher-order component adding a reducer to a component. Its API is similar to `connect`, with `mapStateToProps` being replaced by a reducer. It will spread the output of its reducer to props, alongside binded action creators. The need for selectors is removed.

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

#### __setContextTypes__

When using `withReducer`, you need to define a reducer creator (factory).

```js
const reducerCreator = (props, context) => { /* return reducer */ }
```

`context` will contain your `store` (if you have one in context), and to add anything to it you can use `setContextTypes`:

```js
import PropTypes from 'prop-types'
import { setContextTypes } from 'react-local-reducer'

setContextTypes({
  storage: PropTypes.object.isRequired
})
```

#### __onDispatchStoreEnhancer__

You can have your local reducers receive any action your global redux store receives. Simply use the redux store enhancer `onDispatchStoreEnhancer`.

```js
import { createStore } from 'redux'
import { onDispatchStoreEnhancer } from 'react-local-reducer'

const store = createStore(reducer, initialState, onDispatchStoreEnhancer)
```

For composing multiple store enhancers, look at: http://redux.js.org/docs/api/compose.html
