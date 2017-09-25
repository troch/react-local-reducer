# react-local-reducer

[![Build Status](https://travis-ci.org/troch/react-local-reducer.svg?branch=master)](https://travis-ci.org/troch/react-local-reducer)
[![npm version](https://badge.fury.io/js/react-local-reducer.svg)](https://badge.fury.io/js/react-local-reducer)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A tiny library (~1k gzipped) to use redux-style reducers locally in your React components. No external dependency, it can be used without a redux store.

```sh
npm install --save react-local-reducer
# or
yarn add react-local-reducer
```

### Why?

Scaling an application with redux means adding more and more reducers to your global store, most of which will end up not being concerned by what components are mounted. It has an impact on performance and on bundle size: reducers cannot be code split as they need to be imported at store creation.

Not everything needs to be in a global store, especially if it is not shared across your application. For example, it is possible to have a redux store to cache network data (like Apollo) and manage the rest of your application state with local state.


### React local reducers

- This solution is a local state solution, and __colocates reducers with their components__
- Reducers are created using `props` and `context` so they can be initialised, and they must return an object
- Reducers can receive actions from your main store, thanks to a store enhancer provided by this package

#### __withReducer(reducerCreator, mapDispatchToProps)__

`withReducer` is a higher-order component adding a reducer to a component. Its API is similar to `connect`, with `mapStateToProps` being replaced by a reducer. It will spread the output of its reducer to props, alongside binded action creators. The need for selectors is removed.

```js
import React from 'react'
import { withReducer } from 'react-local-reducer'

// Reducer
const reducer = ({ initialCount }) =>
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
    <button onClick={ () => add() }>Plus</button>
    <button onClick={ () => remove() }>Remove</button>
  </div>
)

export default withReducer(
  () => reducer,
  { add, remove }
)(Counter)
```

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
