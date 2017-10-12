'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _defineProperty = _interopDefault(require('babel-runtime/helpers/defineProperty'));

function onDispatchStoreEnhancer(createStore) {
  return function (reducer, initialState, enhancer) {
    var store = createStore(reducer, initialState, enhancer);

    var dispatch = store.dispatch;
    var onDispatchHandlers = [];

    store.onDispatch = function (callback) {
      onDispatchHandlers.push(callback);

      return function () {
        onDispatchHandlers = onDispatchHandlers.filter(function (cb) {
          return cb !== callback;
        });
      };
    };

    store.dispatch = function (action) {
      var result = dispatch(action);

      onDispatchHandlers.forEach(function (handler) {
        return handler(action);
      });

      return result;
    };

    return store;
  };
}

var isObject = function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Array.isArray(value);
};

var keysAreEqual = function keysAreEqual(left, right) {
  return _Object$keys(left).length === _Object$keys(right).length && _Object$keys(left).every(function (leftKey) {
    return left[leftKey] === right[leftKey];
  });
};

var shallowEquals = function shallowEquals(left, right) {
  return left === right || keysAreEqual(left, right);
};

var bindActionCreatorsObject = function bindActionCreatorsObject(mapDispatchToProps, dispatchAction) {
  return _Object$keys(mapDispatchToProps).reduce(function (actionCreators, actionName) {
    return _Object$assign({}, actionCreators, _defineProperty({}, actionName, function () {
      var actionCreator = mapDispatchToProps[actionName];
      var action = actionCreator.apply(undefined, arguments);

      dispatchAction(action);
    }));
  }, {});
};

var bindActionCreators = function bindActionCreators(mapDispatchToProps, dispatchAction) {
  var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof mapDispatchToProps === 'function') {
    return mapDispatchToProps(dispatchAction, props);
  } else if ((typeof mapDispatchToProps === 'undefined' ? 'undefined' : _typeof(mapDispatchToProps)) === 'object') {
    return bindActionCreatorsObject(mapDispatchToProps, dispatchAction);
  }

  return {};
};

var contextTypes = {};

var getContextTypes = function getContextTypes() {
  return contextTypes;
};

var setContextTypes = function setContextTypes(types) {
  return contextTypes = types;
};

var initAction = {
  type: '@@localReducer/INIT'
};

var defaultOptions = {
  listenToStoreActions: true
};

var withReducer = function withReducer(createReducer, mapDispatchToProps, options) {
  return function (WrappedComponent) {
    var WithReducer = function (_PureComponent) {
      _inherits(WithReducer, _PureComponent);

      function WithReducer(props, context) {
        _classCallCheck(this, WithReducer);

        var _this = _possibleConstructorReturn(this, (WithReducer.__proto__ || _Object$getPrototypeOf(WithReducer)).call(this, props, context));

        _this.dispatchAction = function (action) {
          if (!isObject(action) || !action.type) {
            console.error('[' + componentName + '][dispatch] Expected an action object with type, got:', action);
            return;
          }

          var newState = _this.reducer(action, _this.state);

          if (!isObject(newState)) {
            console.error('[' + componentName + '][reducer] Expected an object to be returned, got:', newState);
          }

          if (!shallowEquals(_this.state, newState)) {
            _this.replaceState(newState);
          }
        };

        _this.reducer = createReducer(props, context);
        _this.state = _this.reducer(undefined, initAction);
        _this.actionCreators = bindActionCreators(mapDispatchToProps, _this.dispatchAction, _this.props);

        var store = context.store;

        var finalOptions = _Object$assign({}, defaultOptions, options);

        if (store && store.onDispatch) {
          if (finalOptions.listenToStoreActions) {
            _this.unsubscribe = store.onDispatch(_this.dispatchAction);
          }
        }
        return _this;
      }

      _createClass(WithReducer, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (this.unsubscribe) {
            this.unsubscribe();
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return React__default.createElement(WrappedComponent, _Object$assign({}, this.props, this.state, this.actionCreators));
        }
      }]);

      return WithReducer;
    }(React.PureComponent);

    WithReducer.contextTypes = _Object$assign({
      store: PropTypes.object
    }, getContextTypes());

    return WithReducer;
  };
};

exports.withReducer = withReducer;
exports.onDispatchStoreEnhancer = onDispatchStoreEnhancer;
exports.setContextTypes = setContextTypes;
