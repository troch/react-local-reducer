'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var isObject = function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Array.isArray(value);
};

var keysAreEqual = function keysAreEqual(left, right) {
  return Object.keys(left).length === Object.keys(right).length && Object.keys(left).every(function (leftKey) {
    return left[leftKey] === right[leftKey];
  });
};

var shallowEquals = function shallowEquals(left, right) {
  return left === right || keysAreEqual(left, right);
};

var bindActionCreatorsObject = function bindActionCreatorsObject(mapDispatchToProps, dispatchAction) {
  return Object.keys(mapDispatchToProps).reduce(function (actionCreators, actionName) {
    return Object.assign({}, actionCreators, defineProperty({}, actionName, function () {
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

var defaultMergeProps = function defaultMergeProps() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Object.assign.apply(Object, [{}].concat(args));
};

var withReducer = function withReducer(createReducer, mapDispatchToProps, mergeProps) {
  return function (WrappedComponent) {
    var WithReducer = function (_PureComponent) {
      inherits(WithReducer, _PureComponent);

      function WithReducer(props, context) {
        classCallCheck(this, WithReducer);

        var _this = possibleConstructorReturn(this, (WithReducer.__proto__ || Object.getPrototypeOf(WithReducer)).call(this, props, context));

        _this.dispatchAction = function (action) {
          if (!isObject(action) || !action.type) {
            console.error('[' + componentName + '][dispatch] Expected an action object with type, got:', action);
            return;
          }

          var newState = _this.reducer(_this.state, action);

          if (!isObject(newState)) {
            console.error('[' + componentName + '][reducer] Expected an object to be returned, got:', newState);
          }

          if (!shallowEquals(_this.state, newState)) {
            _this.setState(newState);
          }
        };

        _this.mergeProps = mergeProps || defaultMergeProps;
        _this.reducer = createReducer(props, context);
        _this.state = _this.reducer(undefined, initAction);
        _this.actionCreators = bindActionCreators(mapDispatchToProps, _this.dispatchAction, _this.props);

        var store = context.store;


        if (store && store.onDispatch) {
          _this.unsubscribe = store.onDispatch(_this.dispatchAction);
        }
        return _this;
      }

      createClass(WithReducer, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (this.unsubscribe) {
            this.unsubscribe();
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return React__default.createElement(WrappedComponent, this.mergeProps(this.props, this.state, this.actionCreators));
        }
      }]);
      return WithReducer;
    }(React.PureComponent);

    WithReducer.contextTypes = Object.assign({
      store: PropTypes.object
    }, getContextTypes());

    return WithReducer;
  };
};

exports.withReducer = withReducer;
exports.onDispatchStoreEnhancer = onDispatchStoreEnhancer;
exports.setContextTypes = setContextTypes;
