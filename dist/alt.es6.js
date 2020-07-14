'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

var Dispatcher_1 = createCommonjsModule(function (module, exports) {
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * 
 * @preventMunge
 */

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = invariant_1;

var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *         case 'city-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

var Dispatcher = (function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastID = 1;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   */

  Dispatcher.prototype.register = function register(callback) {
    var id = _prefix + this._lastID++;
    this._callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   */

  Dispatcher.prototype.unregister = function unregister(id) {
    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
    delete this._callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   */

  Dispatcher.prototype.waitFor = function waitFor(ids) {
    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this._isPending[id]) {
        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
        continue;
      }
      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
      this._invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   */

  Dispatcher.prototype.dispatch = function dispatch(payload) {
    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
    this._startDispatching(payload);
    try {
      for (var id in this._callbacks) {
        if (this._isPending[id]) {
          continue;
        }
        this._invokeCallback(id);
      }
    } finally {
      this._stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   */

  Dispatcher.prototype.isDispatching = function isDispatching() {
    return this._isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @internal
   */

  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
    this._isPending[id] = true;
    this._callbacks[id](this._pendingPayload);
    this._isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
    for (var id in this._callbacks) {
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._pendingPayload = payload;
    this._isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
    delete this._pendingPayload;
    this._isDispatching = false;
  };

  return Dispatcher;
})();

module.exports = Dispatcher;
});

/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var Dispatcher = Dispatcher_1;

const isFunction = function (x) {
  return typeof x === 'function';
};

function isMutableObject(target) {
  const Ctor = target.constructor;

  return !!target && Object.prototype.toString.call(target) === '[object Object]' && isFunction(Ctor) && !Object.isFrozen(target) && (Ctor instanceof Ctor || target.type === 'AltStore');
}

function eachObject(f, o) {
  o.forEach(function (from) {
    Object.keys(Object(from)).forEach(function (key) {
      f(key, from[key]);
    });
  });
}

function assign(target) {
  for (var _len = arguments.length, source = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    source[_key - 1] = arguments[_key];
  }

  eachObject(function (key, value) {
    return target[key] = value;
  }, source);
  return target;
}

function setAppState(instance, data, onStore) {
  const obj = instance.deserialize(data);
  eachObject(function (key, value) {
    const store = instance.stores[key];
    if (store) {
      const config = store.StoreModel.config;

      const state = store.state;
      if (config.onDeserialize) obj[key] = config.onDeserialize(value) || value;
      if (isMutableObject(state)) {
        // If we are assigning the new values "merging" with the old ones, why would we delete everything first?
        // fn.eachObject(k => delete state[k], [state])
        assign(state, obj[key]);
      } else {
        store.state = obj[key];
      }
      onStore(store, store.state);
    }
  }, [obj]);
}

function snapshot(instance) {
  let storeNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  const stores = storeNames.length ? storeNames : Object.keys(instance.stores);
  return stores.reduce(function (obj, storeHandle) {
    const storeName = storeHandle.displayName || storeHandle;
    const store = instance.stores[storeName];
    const config = store.StoreModel.config;

    store.lifecycle('snapshot');
    const customSnapshot = config.onSerialize && config.onSerialize(store.state);
    obj[storeName] = customSnapshot ? customSnapshot : store.getState();
    return obj;
  }, {});
}

function saveInitialSnapshot(instance, key) {
  const state = instance.deserialize(instance.serialize(instance.stores[key].state));
  instance._initSnapshot[key] = state;
  instance._lastSnapshot[key] = state;
}

function filterSnapshots(instance, state, stores) {
  return stores.reduce(function (obj, store) {
    const storeName = store.displayName || store;
    if (!state[storeName]) {
      throw new ReferenceError(`${storeName} is not a valid store`);
    }
    obj[storeName] = state[storeName];
    return obj;
  }, {});
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*eslint-disable*/
const builtIns = Object.getOwnPropertyNames(NoopClass);
const builtInProto = Object.getOwnPropertyNames(NoopClass.prototype);
/*eslint-enable*/

function getInternalMethods(Obj, isProto) {
  const excluded = isProto ? builtInProto : builtIns;
  const obj = isProto && typeof Obj === 'function' ? Obj.prototype : Obj;
  return Object.getOwnPropertyNames(obj).reduce(function (value, m) {
    if (excluded.indexOf(m) !== -1) {
      return value;
    }

    value[m] = obj[m];
    return value;
  }, {});
}

function getPrototypeChain(Obj) {
  let methods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return Obj === Object.prototype ? methods : getPrototypeChain(Object.getPrototypeOf(typeof Obj === 'function' ? Obj.prototype : Obj), assign(getInternalMethods(Obj, true), methods));
}

function warn(msg) {
  /* istanbul ignore else */
  /*eslint-disable*/
  if (typeof console !== 'undefined') {
    console.warn(new ReferenceError(msg));
  }
  /*eslint-enable*/
}

function uid(container, name) {
  let count = 0;
  let key = name;
  while (Object.hasOwnProperty.call(container, key)) {
    key = name + String(++count);
  }
  return key;
}

function formatAsConstant(name) {
  return name.replace(/[a-z]([A-Z])/g, function (i) {
    return `${i[0]}_${i[1].toLowerCase()}`;
  }).toUpperCase();
}

function dispatchIdentity(x) {
  if (x === undefined) return null;

  for (var _len = arguments.length, a = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    a[_key - 1] = arguments[_key];
  }

  return a.length ? [x].concat(a) : x;
}

function fsa(id, type, payload, details) {
  return {
    type: type,
    payload: payload,
    meta: _extends({
      dispatchId: id
    }, details),

    id: id,
    action: type,
    data: payload,
    details: details
  };
}

function dispatch(id, actionObj, payload, alt) {
  const data = actionObj.dispatch(payload);
  if (data === undefined) return null;

  const type = actionObj.id;
  const namespace = type;
  const name = type;
  const details = { id: type, namespace: namespace, name: name };

  const dispatchLater = function (x) {
    return alt.dispatch(type, x, details);
  };

  if (isFunction(data)) return data(dispatchLater, alt);

  // XXX standardize this
  return alt.dispatcher.dispatch(fsa(id, type, data, details));
}

/* istanbul ignore next */
function NoopClass() {}

function transmitter() {
  var subscriptions = [];
  var nowDispatching = false;
  var toUnsubscribe = {};

  var unsubscribe = function unsubscribe(onChange) {
    var id = subscriptions.indexOf(onChange);
    if (id < 0) return;
    if (nowDispatching) {
      toUnsubscribe[id] = onChange;
      return;
    }
    subscriptions.splice(id, 1);
  };

  var subscribe = function subscribe(onChange) {
    var id = subscriptions.push(onChange);
    var dispose = function dispose() {
      return unsubscribe(onChange);
    };
    return { dispose: dispose };
  };

  var publish = function publish() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    nowDispatching = true;
    try {
      subscriptions.forEach(function (subscription, id) {
        return toUnsubscribe[id] || subscription.apply(undefined, args);
      });
    } finally {
      nowDispatching = false;
      Object.keys(toUnsubscribe).forEach(function (id) {
        return unsubscribe(toUnsubscribe[id]);
      });
      toUnsubscribe = {};
    }
  };

  return {
    publish: publish,
    subscribe: subscribe,
    $subscriptions: subscriptions
  };
}

var transmitter_1 = transmitter;

class AltStore {
  constructor(alt, model, state, StoreModel) {
    var _this = this;

    const lifecycleEvents = model.lifecycleEvents;
    this.transmitter = transmitter_1();
    this.lifecycle = function (event, x) {
      if (lifecycleEvents[event]) lifecycleEvents[event].publish(x);
    };
    this.state = state;

    this.alt = alt;
    this.preventDefault = false;
    this.displayName = model.displayName;
    this.boundListeners = model.boundListeners;
    this.StoreModel = StoreModel;
    this.reduce = model.reduce || function (x) {
      return x;
    };
    this.subscriptions = [];

    const output = model.output || function (x) {
      return x;
    };

    this.emitChange = function () {
      return _this.transmitter.publish(output(_this.state));
    };

    const handleDispatch = function (f, payload) {
      try {
        return f();
      } catch (e) {
        if (model.handlesOwnErrors) {
          _this.lifecycle('error', {
            error: e,
            payload: payload,
            state: _this.state
          });
          return false;
        }

        throw e;
      }
    };

    assign(this, model.publicMethods);

    // Register dispatcher
    this.dispatchToken = alt.dispatcher.register(function (payload) {
      _this.preventDefault = false;

      _this.lifecycle('beforeEach', {
        payload: payload,
        state: _this.state
      });

      const actionHandlers = model.actionListeners[payload.action];

      if (actionHandlers || model.otherwise) {
        let result;

        if (actionHandlers) {
          result = handleDispatch(function () {
            return actionHandlers.filter(Boolean).every(function (handler) {
              return handler.call(model, payload.data, payload.action) !== false;
            });
          }, payload);
        } else {
          result = handleDispatch(function () {
            return model.otherwise(payload.data, payload.action);
          }, payload);
        }

        if (result !== false && !_this.preventDefault) _this.emitChange();
      }

      if (model.reduce) {
        handleDispatch(function () {
          const value = model.reduce(_this.state, payload);
          if (value !== undefined) _this.state = value;
        }, payload);
        if (!_this.preventDefault) _this.emitChange();
      }

      _this.lifecycle('afterEach', {
        payload: payload,
        state: _this.state
      });
    });

    this.lifecycle('init');
  }

  listen(cb) {
    var _this2 = this;

    if (!isFunction(cb)) throw new TypeError('listen expects a function');

    var _transmitter$subscrib = this.transmitter.subscribe(cb);

    const dispose = _transmitter$subscrib.dispose;

    this.subscriptions.push({ cb: cb, dispose: dispose });
    return function () {
      _this2.lifecycle('unlisten');
      dispose();
    };
  }

  unlisten(cb) {
    this.lifecycle('unlisten');
    this.subscriptions.filter(function (subscription) {
      return subscription.cb === cb;
    }).forEach(function (subscription) {
      return subscription.dispose();
    });
  }

  getState() {
    return this.StoreModel.config.getState.call(this, this.state);
  }
}

const StoreMixin = {
  waitFor: function () {
    for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }

    if (!sources.length) {
      throw new ReferenceError('Dispatch tokens not provided');
    }

    let sourcesArray = sources;
    if (sources.length === 1) {
      sourcesArray = Array.isArray(sources[0]) ? sources[0] : sources;
    }

    const tokens = sourcesArray.map(function (source) {
      return source.dispatchToken || source;
    });

    this.dispatcher.waitFor(tokens);
  },
  exportAsync: function (asyncMethods) {
    this.registerAsync(asyncMethods);
  },
  registerAsync: function (asyncDef) {
    var _this = this;

    let loadCounter = 0;

    const asyncMethods = isFunction(asyncDef) ? asyncDef(this.alt) : asyncDef;

    const toExport = Object.keys(asyncMethods).reduce(function (publicMethods, methodName) {
      const desc = asyncMethods[methodName];
      const spec = isFunction(desc) ? desc(_this) : desc;

      const validHandlers = ['success', 'error', 'loading'];
      validHandlers.forEach(function (handler) {
        if (spec[handler] && !spec[handler].id) {
          throw new Error(`${handler} handler must be an action function`);
        }
      });

      publicMethods[methodName] = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        const state = _this.getInstance().getState();
        const value = spec.local && spec.local.apply(spec, [state].concat(args));
        const shouldFetch = spec.shouldFetch ? spec.shouldFetch.apply(spec, [state].concat(args))
        /*eslint-disable*/
        : value == null;
        /*eslint-enable*/
        const intercept = spec.interceptResponse || function (x) {
          return x;
        };

        const makeActionHandler = function (action, isError) {
          return function (x) {
            const fire = function () {
              loadCounter -= 1;
              action(intercept(x, action, args));
              if (isError) throw x;
              return x;
            };
            return _this.alt.trapAsync ? function () {
              return fire();
            } : fire();
          };
        };

        // if we don't have it in cache then fetch it
        if (shouldFetch) {
          loadCounter += 1;
          /* istanbul ignore else */
          if (spec.loading) spec.loading(intercept(null, spec.loading, args));
          return spec.remote.apply(spec, [state].concat(args)).then(makeActionHandler(spec.success), makeActionHandler(spec.error, 1));
        }

        // otherwise emit the change now
        _this.emitChange();
        return value;
      };

      return publicMethods;
    }, {});

    this.exportPublicMethods(toExport);
    this.exportPublicMethods({
      isLoading: function () {
        return loadCounter > 0;
      }
    });
  },
  exportPublicMethods: function (methods) {
    var _this2 = this;

    eachObject(function (methodName, value) {
      if (!isFunction(value)) {
        throw new TypeError('exportPublicMethods expects a function');
      }

      _this2.publicMethods[methodName] = value;
    }, [methods]);
  },
  emitChange: function () {
    this.getInstance().emitChange();
  },
  on: function (lifecycleEvent, handler) {
    if (lifecycleEvent === 'error') this.handlesOwnErrors = true;
    const bus = this.lifecycleEvents[lifecycleEvent] || transmitter_1();
    this.lifecycleEvents[lifecycleEvent] = bus;
    return bus.subscribe(handler.bind(this));
  },
  bindAction: function (symbol, handler) {
    if (!symbol) {
      throw new ReferenceError('Invalid action reference passed in');
    }
    if (!isFunction(handler)) {
      throw new TypeError('bindAction expects a function');
    }

    // You can pass in the constant or the function itself
    const key = symbol.id ? symbol.id : symbol;
    this.actionListeners[key] = this.actionListeners[key] || [];
    this.actionListeners[key].push(handler.bind(this));
    this.boundListeners.push(key);
  },
  bindActions: function (actions) {
    var _this3 = this;

    eachObject(function (action, symbol) {
      const matchFirstCharacter = /./;
      const assumedEventHandler = action.replace(matchFirstCharacter, function (x) {
        return `on${x[0].toUpperCase()}`;
      });

      if (_this3[action] && _this3[assumedEventHandler]) {
        // If you have both action and onAction
        throw new ReferenceError(`You have multiple action handlers bound to an action: ` + `${action} and ${assumedEventHandler}`);
      }

      const handler = _this3[action] || _this3[assumedEventHandler];
      if (handler) {
        _this3.bindAction(symbol, handler);
      }
    }, [actions]);
  },
  bindListeners: function (obj) {
    var _this4 = this;

    eachObject(function (methodName, symbol) {
      const listener = _this4[methodName];

      if (!listener) {
        throw new ReferenceError(`${methodName} defined but does not exist in ${_this4.displayName}`);
      }

      if (Array.isArray(symbol)) {
        symbol.forEach(function (action) {
          _this4.bindAction(action, listener);
        });
      } else {
        _this4.bindAction(symbol, listener);
      }
    }, [obj]);
  }
};

function doSetState(store, storeInstance, state) {
  if (!state) {
    return;
  }

  const config = storeInstance.StoreModel.config;


  const nextState = isFunction(state) ? state(storeInstance.state) : state;

  storeInstance.state = config.setState.call(store, storeInstance.state, nextState);

  if (!store.alt.dispatcher.isDispatching()) {
    store.emitChange();
  }
}

function createPrototype(proto, alt, key, extras) {
  return assign(proto, StoreMixin, {
    displayName: key,
    alt: alt,
    dispatcher: alt.dispatcher,
    preventDefault: function () {
      this.getInstance().preventDefault = true;
    },

    boundListeners: [],
    lifecycleEvents: {},
    actionListeners: {},
    publicMethods: {},
    handlesOwnErrors: false
  }, extras);
}

function createStoreConfig(globalConfig, StoreModel) {
  StoreModel.config = assign({
    getState: function (state) {
      if (Array.isArray(state)) {
        return state.slice();
      } else if (isMutableObject(state)) {
        return assign({}, state);
      }

      return state;
    },
    setState: function (currentState, nextState) {
      if (isMutableObject(nextState)) {
        return assign(currentState, nextState);
      }
      return nextState;
    }
  }, globalConfig, StoreModel.config);
}

function transformStore(transforms, StoreModel) {
  return transforms.reduce(function (Store, transform) {
    return transform(Store);
  }, StoreModel);
}

function createStoreFromObject(alt, StoreModel, key) {
  let storeInstance;

  const StoreProto = createPrototype({}, alt, key, assign({
    getInstance: function () {
      return storeInstance;
    },
    setState: function (nextState) {
      doSetState(this, storeInstance, nextState);
    }
  }, StoreModel));

  // bind the store listeners
  /* istanbul ignore else */
  if (StoreProto.bindListeners) {
    StoreMixin.bindListeners.call(StoreProto, StoreProto.bindListeners);
  }
  /* istanbul ignore else */
  if (StoreProto.observe) {
    StoreMixin.bindListeners.call(StoreProto, StoreProto.observe(alt));
  }

  // bind the lifecycle events
  /* istanbul ignore else */
  if (StoreProto.lifecycle) {
    eachObject(function (eventName, event) {
      StoreMixin.on.call(StoreProto, eventName, event);
    }, [StoreProto.lifecycle]);
  }

  // create the instance and fn.assign the public methods to the instance
  storeInstance = assign(new AltStore(alt, StoreProto, StoreProto.state !== undefined ? StoreProto.state : {}, StoreModel), StoreProto.publicMethods, {
    displayName: key,
    config: StoreModel.config
  });

  return storeInstance;
}

function createStoreFromClass(alt, StoreModel, key) {
  let storeInstance;
  const config = StoreModel.config;

  // Creating a class here so we don't overload the provided store's
  // prototype with the mixin behaviour and I'm extending from StoreModel
  // so we can inherit any extensions from the provided store.

  class Store extends StoreModel {
    constructor(a1, a2, a3, a4, a5, a6, a7, a8) {
      super(a1, a2, a3, a4, a5, a6, a7, a8);
    }
  }

  createPrototype(Store.prototype, alt, key, {
    type: 'AltStore',
    getInstance: function () {
      return storeInstance;
    },
    setState: function (nextState) {
      doSetState(this, storeInstance, nextState);
    }
  });

  for (var _len = arguments.length, argsForClass = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    argsForClass[_key - 3] = arguments[_key];
  }

  const store = new (Function.prototype.bind.apply(Store, [null].concat(argsForClass)))();

  /* istanbul ignore next */
  if (config.bindListeners) store.bindListeners(config.bindListeners);
  /* istanbul ignore next */
  if (config.datasource) store.registerAsync(config.datasource);

  storeInstance = assign(new AltStore(alt, store, store.state !== undefined ? store.state : store, StoreModel), getInternalMethods(StoreModel), config.publicMethods, { displayName: key });

  return storeInstance;
}

var store = Object.freeze({
	createStoreConfig: createStoreConfig,
	transformStore: transformStore,
	createStoreFromObject: createStoreFromObject,
	createStoreFromClass: createStoreFromClass
});

var index$2 = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function makeAction(alt, namespace, name, implementation, obj) {
  const id = uid(alt._actionsRegistry, `${namespace}.${name}`);
  alt._actionsRegistry[id] = 1;

  let logAs;
  let storeStateToLog;
  // Set action's log level
  if (typeof Reflect === 'object' && isFunction(Reflect.getOwnMetadata)) {
    logAs = Reflect.getOwnMetadata('alt:meta:logAs', implementation);
  }
  // Set action's additional store state data
  if (typeof Reflect === 'object' && isFunction(Reflect.getOwnMetadata)) {
    storeStateToLog = Reflect.getOwnMetadata('alt:meta:storeStateToLog', implementation);
  }

  const data = { id: id, namespace: namespace, name: name, logAs: logAs, storeStateToLog: storeStateToLog };

  const dispatch$$1 = function (payload) {
    return alt.dispatch(id, payload, data);
  };

  // the action itself
  const action = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    let inject;
    // check for action's implementation metadata if dispatch should be injected
    // for example when decorated via @Reflect.metadata
    // (https://github.com/rbuckton/ReflectDecorators#syntax)
    if (typeof Reflect === 'object' && isFunction(Reflect.getOwnMetadata)) {
      inject = Reflect.getOwnMetadata('alt:injectDispatch', implementation);

      if (inject === true) {
        // diff number of declared arguments and number of passed in arguments
        const diff = implementation.length - args.length;

        if (diff > 0) {
          const optionalArgs = Array.apply(null, Array(diff));
          // explicitely pass optional parameters as undefined
          args.push.apply(args, optionalArgs);
        }

        // pass dispatch as the n+1 th parameter to action implementation
        args.push(dispatch$$1);
      }
    }

    const invocationResult = implementation.apply(obj, args);

    let actionResult = invocationResult;

    // async functions that return promises should not be dispatched
    if (invocationResult !== undefined && !index$2(invocationResult)) {
      if (isFunction(invocationResult)) {
        // inner function result should be returned as an action result
        actionResult = invocationResult(dispatch$$1, alt);
      } else {
        if (!inject) {
          dispatch$$1(invocationResult);
        }
      }
    }

    if (!inject && invocationResult === undefined) {
      warn('An action was called but nothing was dispatched');
    }

    return actionResult;
  };
  action.defer = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return setTimeout(function () {
      return action.apply(null, args);
    });
  };
  action.id = id;
  action.data = data;
  action.dispatch = dispatch$$1;

  // ensure each reference is unique in the namespace
  const container = alt.actions[namespace];
  const namespaceId = uid(container, name);
  container[namespaceId] = action;

  // generate a constant
  const constant = formatAsConstant(namespaceId);
  container[constant] = id;

  return action;
}

/* global window */
class Alt {
  constructor() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.config = config;
    this.serialize = config.serialize || JSON.stringify;
    this.deserialize = config.deserialize || JSON.parse;
    this.dispatcher = config.dispatcher || new Dispatcher();
    this.batchingFunction = config.batchingFunction || function (callback) {
      return callback();
    };
    this.actions = { global: {} };
    this.stores = {};
    this.storeTransforms = config.storeTransforms || [];
    this.trapAsync = false;
    this._actionsRegistry = {};
    this._initSnapshot = {};
    this._lastSnapshot = {};
  }

  dispatch(action, data, details) {
    var _this = this;

    this.batchingFunction(function () {
      const id = Math.random().toString(18).substr(2, 16);

      // support straight dispatching of FSA-style actions
      if (action.hasOwnProperty('type') && action.hasOwnProperty('payload')) {
        const fsaDetails = {
          id: action.type,
          namespace: action.type,
          name: action.type
        };
        return _this.dispatcher.dispatch(fsa(id, action.type, action.payload, fsaDetails));
      }

      if (action.id && action.dispatch) {
        return dispatch(id, action, data, _this);
      }

      return _this.dispatcher.dispatch(fsa(id, action, data, details));
    });
  }

  createUnsavedStore(StoreModel) {
    const key = StoreModel.displayName || '';
    createStoreConfig(this.config, StoreModel);
    const Store = transformStore(this.storeTransforms, StoreModel);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return isFunction(Store) ? createStoreFromClass.apply(store, [this, Store, key].concat(args)) : createStoreFromObject(this, Store, key);
  }

  createStore(StoreModel, iden) {
    let key = iden || StoreModel.displayName || StoreModel.name || '';
    createStoreConfig(this.config, StoreModel);
    const Store = transformStore(this.storeTransforms, StoreModel);

    /* istanbul ignore next */
    if (module.hot) delete this.stores[key];

    if (this.stores[key] || !key) {
      if (this.stores[key]) {
        warn(`A store named ${key} already exists, double check your store ` + `names or pass in your own custom identifier for each store`);
      } else {
        warn('Store name was not specified');
      }

      key = uid(this.stores, key);
    }

    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    const storeInstance = isFunction(Store) ? createStoreFromClass.apply(store, [this, Store, key].concat(args)) : createStoreFromObject(this, Store, key);

    this.stores[key] = storeInstance;
    saveInitialSnapshot(this, key);

    return storeInstance;
  }

  generateActions() {
    const actions = { name: 'global' };

    for (var _len3 = arguments.length, actionNames = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      actionNames[_key3] = arguments[_key3];
    }

    return this.createActions(actionNames.reduce(function (obj, action) {
      obj[action] = dispatchIdentity;
      return obj;
    }, actions));
  }

  createAction(name, implementation, obj) {
    return makeAction(this, 'global', name, implementation, obj);
  }

  createActions(ActionsClass) {
    var _this2 = this;

    let exportObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    const actions = {};
    const key = uid(this._actionsRegistry, ActionsClass.displayName || ActionsClass.name || 'Unknown');

    if (isFunction(ActionsClass)) {
      assign(actions, getPrototypeChain(ActionsClass));
      class ActionsGenerator extends ActionsClass {
        constructor(a1, a2, a3, a4, a5, a6, a7, a8) {
          super(a1, a2, a3, a4, a5, a6, a7, a8);
        }

        generateActions() {
          for (var _len5 = arguments.length, actionNames = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            actionNames[_key5] = arguments[_key5];
          }

          actionNames.forEach(function (actionName) {
            actions[actionName] = dispatchIdentity;
          });
        }
      }

      for (var _len4 = arguments.length, argsForConstructor = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        argsForConstructor[_key4 - 2] = arguments[_key4];
      }

      assign(actions, new (Function.prototype.bind.apply(ActionsGenerator, [null].concat(argsForConstructor)))());
    } else {
      assign(actions, ActionsClass);
    }

    this.actions[key] = this.actions[key] || {};

    eachObject(function (actionName, action) {
      if (!isFunction(action)) {
        exportObj[actionName] = action;
        return;
      }

      // Don't make an action out of method/function with
      // "alt:skipMakeAction" metadata (via @Reflect.metadata decorator)
      if (typeof Reflect === 'object' && isFunction(Reflect.getOwnMetadata)) {
        const skip = Reflect.getOwnMetadata('alt:skipMakeAction', action);

        if (skip === true) {
          exportObj[actionName] = action;
          return;
        }
      }

      // create the action
      exportObj[actionName] = makeAction(_this2, key, actionName, action, exportObj);

      // generate a constant
      const constant = formatAsConstant(actionName);
      exportObj[constant] = exportObj[actionName].id;
    }, [actions]);

    return exportObj;
  }

  takeSnapshot() {
    for (var _len6 = arguments.length, storeNames = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      storeNames[_key6] = arguments[_key6];
    }

    const state = snapshot(this, storeNames);
    assign(this._lastSnapshot, state);
    return this.serialize(state);
  }

  rollback() {
    setAppState(this, this.serialize(this._lastSnapshot), function (storeInst) {
      storeInst.lifecycle('rollback');
      storeInst.emitChange();
    });
  }

  recycle() {
    for (var _len7 = arguments.length, storeNames = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      storeNames[_key7] = arguments[_key7];
    }

    const initialSnapshot = storeNames.length ? filterSnapshots(this, this._initSnapshot, storeNames) : this._initSnapshot;

    setAppState(this, this.serialize(initialSnapshot), function (storeInst) {
      storeInst.lifecycle('init');
      storeInst.emitChange();
    });
  }

  flush() {
    const state = this.serialize(snapshot(this));
    this.recycle();
    return state;
  }

  bootstrap(data) {
    setAppState(this, data, function (storeInst, state) {
      storeInst.lifecycle('bootstrap', state);
      storeInst.emitChange();
    });
  }

  prepare(storeInst, payload) {
    const data = {};
    if (!storeInst.displayName) {
      throw new ReferenceError('Store provided does not have a name');
    }
    data[storeInst.displayName] = payload;
    return this.serialize(data);
  }

  // Instance type methods for injecting alt into your application as context

  addActions(name, ActionsClass) {
    for (var _len8 = arguments.length, args = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
      args[_key8 - 2] = arguments[_key8];
    }

    this.actions[name] = Array.isArray(ActionsClass) ? this.generateActions.apply(this, ActionsClass) : this.createActions.apply(this, [ActionsClass].concat(args));
  }

  addStore(name, StoreModel) {
    for (var _len9 = arguments.length, args = Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
      args[_key9 - 2] = arguments[_key9];
    }

    this.createStore.apply(this, [StoreModel, name].concat(args));
  }

  getActions(name) {
    return this.actions[name];
  }

  getStore(name) {
    return this.stores[name];
  }

  static debug(name, alt, win) {
    const key = 'alt.js.org';
    let context = win;
    if (!context && typeof window !== 'undefined') {
      context = window;
    }
    if (typeof context !== 'undefined') {
      context[key] = context[key] || [];
      context[key].push({ name: name, alt: alt });
    }
    return alt;
  }
}

module.exports = Alt;
//# sourceMappingURL=alt.es6.js.map
