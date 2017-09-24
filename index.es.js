import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

function onDispatchStoreEnhancer(createStore) {
  return function(reducer, initialState, enhancer) {
    var store = createStore(reducer, initialState, enhancer)

    var dispatch = store.dispatch
    var onDispatchHandlers = []

    store.onDispatch = function(callback) {
      onDispatchHandlers.push(callback)

      return function() {
        onDispatchHandlers = onDispatchHandlers.filter(function(cb) {
          return cb !== callback
        })
      }
    }

    store.dispatch = function(action) {
      var result = dispatch(action)

      onDispatchHandlers.forEach(function(handler) {
        return handler(action)
      })

      return result
    }

    return store
  }
}

var keysAreEqual = function keysAreEqual(left, right) {
  return (
    Object.keys(left).length === Object.keys(right).length &&
    Object.keys(left).every(function(leftKey) {
      return left[leftKey] === right[leftKey]
    })
  )
}

var shallowEquals = function shallowEquals(left, right) {
  return left === right || keysAreEqual(left, right)
}

var isObject = function isObject(value) {
  return (
    (typeof value === 'undefined'
      ? 'undefined'
      : babelHelpers.typeof(value)) === 'object' && !Array.isArray(value)
  )
}

var bindActionCreatorsObject = function bindActionCreatorsObject(
  mapDispatchToProps,
  dispatchAction
) {
  return Object.keys(mapDispatchToProps).reduce(function(
    actionCreators,
    actionName
  ) {
    return Object.assign(
      {},
      actionCreators,
      babelHelpers.defineProperty({}, actionName, function() {
        var actionCreator = mapDispatchToProps[actionName]
        var action = actionCreator.apply(undefined, arguments)

        dispatchAction(action)
      })
    )
  }, {})
}

var bindActionCreators = function bindActionCreators(
  mapDispatchToProps,
  dispatchAction
) {
  var props =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}

  if (typeof mapDispatchToProps === 'function') {
    return mapDispatchToProps(dispatchAction, props)
  } else if (
    (typeof mapDispatchToProps === 'undefined'
      ? 'undefined'
      : babelHelpers.typeof(mapDispatchToProps)) === 'object'
  ) {
    return bindActionCreatorsObject(mapDispatchToProps, dispatchAction)
  }

  return {}
}

var contextTypes = {}

var getContextTypes = function getContextTypes() {
  return contextTypes
}

var setContextTypes = function setContextTypes(types) {
  return (contextTypes = types)
}

var initAction = {
  type: '@@localReducer/INIT'
}

var defaultOptions = {
  listenToStoreActions: true
}

var withReducer = function withReducer(
  createReducer,
  mapDispatchToProps,
  options
) {
  return function(WrappedComponent) {
    var WithReducer = (function(_PureComponent) {
      babelHelpers.inherits(WithReducer, _PureComponent)

      function WithReducer(props, context) {
        babelHelpers.classCallCheck(this, WithReducer)

        var _this = babelHelpers.possibleConstructorReturn(
          this,
          (WithReducer.__proto__ || Object.getPrototypeOf(WithReducer)).call(
            this,
            props,
            context
          )
        )

        _this.dispatchAction = function(action) {
          if (!isObject(action) || !action.type) {
            console.error(
              '[' +
                componentName +
                '][dispatch] Expected an action object with type, got:',
              action
            )
            return
          }

          var newState = _this.reducer(action, _this.state)

          if (!isObject(newState)) {
            console.error(
              '[' +
                componentName +
                '][reducer] Expected an object to be returned, got:',
              newState
            )
          }

          if (!shallowEquals(_this.state, newState)) {
            _this.replaceState(newState)
          }
        }

        _this.reducer = createReducer(props, context)
        _this.state = _this.reducer(undefined, initAction)
        _this.actionCreators = bindActionCreators(
          mapDispatchToProps,
          _this.dispatchAction,
          _this.props
        )

        var store = context.store

        var finalOptions = Object.assign({}, defaultOptions, options)

        if (store && store.onDispatch) {
          if (options.listenToStoreActions) {
            _this.unsubscribe = store.onDispatch(_this.dispatchAction)
          }
        }
        return _this
      }

      babelHelpers.createClass(WithReducer, [
        {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            if (this.unsubscribe) {
              this.unsubscribe()
            }
          }
        },
        {
          key: 'render',
          value: function render() {
            return React.createElement(
              WrappedComponent,
              Object.assign({}, this.props, this.state, this.actionCreators)
            )
          }
        }
      ])
      return WithReducer
    })(PureComponent)

    WithReducer.contextTypes = Object.assign(
      {
        store: PropTypes.object
      },
      getContextTypes()
    )

    return WithReducer
  }
}

export {
  withReducer,
  onDispatchStoreEnhancer as onDispatchEnhancer,
  setContextTypes
}
