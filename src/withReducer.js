import React, { PureComponent } from 'react'

import { shallowEquals, isObject } from './utils/helpers'
import bindActionCreators from './utils/bindActionCreators'
import { getContextType } from './contextType'

const initAction = {
  type: '@@localReducer/INIT'
}

const defaultMergeProps = (...args) => Object.assign({}, ...args)

const withReducer = (
  createReducer,
  mapDispatchToProps,
  mergeProps
) => WrappedComponent => {
  class WithReducer extends PureComponent {
    constructor(props, context) {
      super(props, context)

      this.mergeProps = mergeProps || defaultMergeProps
      this.reducer = createReducer(props, context)
      this.state = this.reducer(undefined, initAction)
      this.actionCreators = bindActionCreators(
        mapDispatchToProps,
        this.dispatchAction,
        this.props
      )

      const { store } = context || {}

      if (store && store.onDispatch) {
        this.unsubscribe = store.onDispatch(this.dispatchAction)
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

      const newState = this.reducer(this.state, action)

      if (!isObject(newState)) {
        console.error(
          `[${componentName}][reducer] Expected an object to be returned, got:`,
          newState
        )
      }

      if (!shallowEquals(this.state, newState)) {
        this.setState(newState)
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }

    render() {
      return React.createElement(
        WrappedComponent,
        this.mergeProps(this.props, this.state, this.actionCreators)
      )
    }
  }

  WithReducer.contextType = getContextType()

  return WithReducer
}

export default withReducer
