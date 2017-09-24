import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import shallowEquals from './utils/shallowEquals'
import isObject from './utils/isObject'
import bindActionCreators from './utils/bindActionCreators'
import { getContextTypes } from './contextTypes'

const initAction = {
  type: '@@localReducer/INIT'
}

const defaultOptions = {
  listenToStoreActions: true
}

const withReducer = (
  createReducer,
  mapDispatchToProps,
  options
) => WrappedComponent => {
  class WithReducer extends PureComponent {
    constructor(props, context) {
      super(props, context)

      this.reducer = createReducer(props, context)
      this.state = this.reducer(undefined, initAction)
      this.actionCreators = bindActionCreators(
        mapDispatchToProps,
        this.dispatchAction,
        this.props
      )

      const { store } = context
      const finalOptions = { ...defaultOptions, ...options }

      if (store && store.onDispatch) {
        if (options.listenToStoreActions) {
          this.unsubscribe = store.onDispatch(this.dispatchAction)
        }
      }
    }

    dispatchAction = action => {
      if (!isObject(action) || !action.type) {
        console.error(
          `[${componentName}][dispatch] Expected an action object with type, got:`,
          action
        )
        return
      }

      const newState = this.reducer(action, this.state)

      if (!isObject(newState)) {
        console.error(
          `[${componentName}][reducer] Expected an object to be returned, got:`,
          newState
        )
      }

      if (!shallowEquals(this.state, newState)) {
        this.replaceState(newState)
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }

    render() {
      return React.createElement(WrappedComponent, {
        ...this.props,
        ...this.state,
        ...this.actionCreators
      })
    }
  }

  WithReducer.contextTypes = {
    store: PropTypes.object,
    ...getContextTypes()
  }

  return WithReducer
}

export default withReducer
