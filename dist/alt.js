(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Alt"] = factory();
	else
		root["Alt"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(2), __webpack_require__(6), __webpack_require__(7), __webpack_require__(8), __webpack_require__(9), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require('flux'), require('./utils/StateFunctions'), require('./functions'), require('./store'), require('./utils/AltUtils'), require('./actions'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.flux, global.StateFunctions, global.functions, global.store, global.AltUtils, global.actions);
	    global.index = mod.exports;
	  }
	})(this, function (module, exports, _flux, _StateFunctions, _functions, _store, _AltUtils, _actions) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var StateFunctions = _interopRequireWildcard(_StateFunctions);

	  var fn = _interopRequireWildcard(_functions);

	  var store = _interopRequireWildcard(_store);

	  var utils = _interopRequireWildcard(_AltUtils);

	  var _actions2 = _interopRequireDefault(_actions);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  /* global window */
	  class Alt {
	    constructor(config = {}) {
	      this.config = config;
	      this.serialize = config.serialize || JSON.stringify;
	      this.deserialize = config.deserialize || JSON.parse;
	      this.dispatcher = config.dispatcher || new _flux.Dispatcher();
	      this.batchingFunction = config.batchingFunction || (callback => callback());
	      this.actions = { global: {} };
	      this.stores = {};
	      this.storeTransforms = config.storeTransforms || [];
	      this.trapAsync = false;
	      this._actionsRegistry = {};
	      this._initSnapshot = {};
	      this._lastSnapshot = {};
	    }

	    dispatch(action, data, details) {
	      this.batchingFunction(() => {
	        const id = Math.random().toString(18).substr(2, 16);

	        // support straight dispatching of FSA-style actions
	        if (action.hasOwnProperty('type') && action.hasOwnProperty('payload')) {
	          const fsaDetails = {
	            id: action.type,
	            namespace: action.type,
	            name: action.type
	          };
	          return this.dispatcher.dispatch(utils.fsa(id, action.type, action.payload, fsaDetails));
	        }

	        if (action.id && action.dispatch) {
	          return utils.dispatch(id, action, data, this);
	        }

	        return this.dispatcher.dispatch(utils.fsa(id, action, data, details));
	      });
	    }

	    createUnsavedStore(StoreModel, ...args) {
	      const key = StoreModel.displayName || '';
	      store.createStoreConfig(this.config, StoreModel);
	      const Store = store.transformStore(this.storeTransforms, StoreModel);

	      return fn.isFunction(Store) ? store.createStoreFromClass(this, Store, key, ...args) : store.createStoreFromObject(this, Store, key);
	    }

	    createStore(StoreModel, iden, ...args) {
	      let key = iden || StoreModel.displayName || StoreModel.name || '';
	      store.createStoreConfig(this.config, StoreModel);
	      const Store = store.transformStore(this.storeTransforms, StoreModel);

	      /* istanbul ignore next */
	      if (module.hot) delete this.stores[key];

	      if (this.stores[key] || !key) {
	        if (this.stores[key]) {
	          utils.warn(`A store named ${ key } already exists, double check your store ` + `names or pass in your own custom identifier for each store`);
	        } else {
	          utils.warn('Store name was not specified');
	        }

	        key = utils.uid(this.stores, key);
	      }

	      const storeInstance = fn.isFunction(Store) ? store.createStoreFromClass(this, Store, key, ...args) : store.createStoreFromObject(this, Store, key);

	      this.stores[key] = storeInstance;
	      StateFunctions.saveInitialSnapshot(this, key);

	      return storeInstance;
	    }

	    generateActions(...actionNames) {
	      const actions = { name: 'global' };
	      return this.createActions(actionNames.reduce((obj, action) => {
	        obj[action] = utils.dispatchIdentity;
	        return obj;
	      }, actions));
	    }

	    createAction(name, implementation, obj) {
	      return (0, _actions2.default)(this, 'global', name, implementation, obj);
	    }

	    createActions(ActionsClass, exportObj = {}, ...argsForConstructor) {
	      const actions = {};
	      const key = utils.uid(this._actionsRegistry, ActionsClass.displayName || ActionsClass.name || 'Unknown');

	      if (fn.isFunction(ActionsClass)) {
	        fn.assign(actions, utils.getPrototypeChain(ActionsClass));
	        class ActionsGenerator extends ActionsClass {
	          constructor(...args) {
	            super(...args);
	          }

	          generateActions(...actionNames) {
	            actionNames.forEach(actionName => {
	              actions[actionName] = utils.dispatchIdentity;
	            });
	          }
	        }

	        fn.assign(actions, new ActionsGenerator(...argsForConstructor));
	      } else {
	        fn.assign(actions, ActionsClass);
	      }

	      this.actions[key] = this.actions[key] || {};

	      fn.eachObject((actionName, action) => {
	        if (!fn.isFunction(action)) {
	          exportObj[actionName] = action;
	          return;
	        }

	        // Don't make an action out of method/function with
	        // "alt:skipMakeAction" metadata (via @Reflect.metadata decorator)
	        if (typeof Reflect === 'object' && fn.isFunction(Reflect.getOwnMetadata)) {
	          const skip = Reflect.getOwnMetadata('alt:skipMakeAction', action);

	          if (skip === true) {
	            exportObj[actionName] = action;
	            return;
	          }
	        }

	        // create the action
	        exportObj[actionName] = (0, _actions2.default)(this, key, actionName, action, exportObj);

	        // generate a constant
	        const constant = utils.formatAsConstant(actionName);
	        exportObj[constant] = exportObj[actionName].id;
	      }, [actions]);

	      return exportObj;
	    }

	    takeSnapshot(...storeNames) {
	      const state = StateFunctions.snapshot(this, storeNames);
	      fn.assign(this._lastSnapshot, state);
	      return this.serialize(state);
	    }

	    rollback() {
	      StateFunctions.setAppState(this, this.serialize(this._lastSnapshot), storeInst => {
	        storeInst.lifecycle('rollback');
	        storeInst.emitChange();
	      });
	    }

	    recycle(...storeNames) {
	      const initialSnapshot = storeNames.length ? StateFunctions.filterSnapshots(this, this._initSnapshot, storeNames) : this._initSnapshot;

	      StateFunctions.setAppState(this, this.serialize(initialSnapshot), storeInst => {
	        storeInst.lifecycle('init');
	        storeInst.emitChange();
	      });
	    }

	    flush() {
	      const state = this.serialize(StateFunctions.snapshot(this));
	      this.recycle();
	      return state;
	    }

	    bootstrap(data) {
	      StateFunctions.setAppState(this, data, (storeInst, state) => {
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

	    addActions(name, ActionsClass, ...args) {
	      this.actions[name] = Array.isArray(ActionsClass) ? this.generateActions.apply(this, ActionsClass) : this.createActions(ActionsClass, ...args);
	    }

	    addStore(name, StoreModel, ...args) {
	      this.createStore(StoreModel, name, ...args);
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
	        context[key].push({ name, alt });
	      }
	      return alt;
	    }
	  }

	  exports.default = Alt;
	  module.exports = exports['default'];
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	module.exports.Dispatcher = __webpack_require__(3);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
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

	var invariant = __webpack_require__(5);

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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

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

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('../functions'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.functions);
	    global.StateFunctions = mod.exports;
	  }
	})(this, function (exports, _functions) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.setAppState = setAppState;
	  exports.snapshot = snapshot;
	  exports.saveInitialSnapshot = saveInitialSnapshot;
	  exports.filterSnapshots = filterSnapshots;

	  var fn = _interopRequireWildcard(_functions);

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  function setAppState(instance, data, onStore) {
	    const obj = instance.deserialize(data);
	    fn.eachObject((key, value) => {
	      const store = instance.stores[key];
	      if (store) {
	        const { config } = store.StoreModel;
	        const state = store.state;
	        if (config.onDeserialize) obj[key] = config.onDeserialize(value) || value;
	        if (fn.isMutableObject(state)) {
	          fn.eachObject(k => delete state[k], [state]);
	          fn.assign(state, obj[key]);
	        } else {
	          store.state = obj[key];
	        }
	        onStore(store, store.state);
	      }
	    }, [obj]);
	  }

	  function snapshot(instance, storeNames = []) {
	    const stores = storeNames.length ? storeNames : Object.keys(instance.stores);
	    return stores.reduce((obj, storeHandle) => {
	      const storeName = storeHandle.displayName || storeHandle;
	      const store = instance.stores[storeName];
	      const { config } = store.StoreModel;
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
	    return stores.reduce((obj, store) => {
	      const storeName = store.displayName || store;
	      if (!state[storeName]) {
	        throw new ReferenceError(`${ storeName } is not a valid store`);
	      }
	      obj[storeName] = state[storeName];
	      return obj;
	    }, {});
	  }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports);
	    global.functions = mod.exports;
	  }
	})(this, function (exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.isMutableObject = isMutableObject;
	  exports.eachObject = eachObject;
	  exports.assign = assign;
	  const isFunction = exports.isFunction = x => typeof x === 'function';

	  function isMutableObject(target) {
	    const Ctor = target.constructor;

	    return !!target && Object.prototype.toString.call(target) === '[object Object]' && isFunction(Ctor) && !Object.isFrozen(target) && (Ctor instanceof Ctor || target.type === 'AltStore');
	  }

	  function eachObject(f, o) {
	    o.forEach(from => {
	      Object.keys(Object(from)).forEach(key => {
	        f(key, from[key]);
	      });
	    });
	  }

	  function assign(target, ...source) {
	    eachObject((key, value) => target[key] = value, source);
	    return target;
	  }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(7), __webpack_require__(10), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('../utils/AltUtils'), require('../functions'), require('./AltStore'), require('./StoreMixin'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.AltUtils, global.functions, global.AltStore, global.StoreMixin);
	    global.index = mod.exports;
	  }
	})(this, function (exports, _AltUtils, _functions, _AltStore, _StoreMixin) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.createStoreConfig = createStoreConfig;
	  exports.transformStore = transformStore;
	  exports.createStoreFromObject = createStoreFromObject;
	  exports.createStoreFromClass = createStoreFromClass;

	  var utils = _interopRequireWildcard(_AltUtils);

	  var fn = _interopRequireWildcard(_functions);

	  var _AltStore2 = _interopRequireDefault(_AltStore);

	  var _StoreMixin2 = _interopRequireDefault(_StoreMixin);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  function doSetState(store, storeInstance, state) {
	    if (!state) {
	      return;
	    }

	    const { config } = storeInstance.StoreModel;

	    const nextState = fn.isFunction(state) ? state(storeInstance.state) : state;

	    storeInstance.state = config.setState.call(store, storeInstance.state, nextState);

	    if (!store.alt.dispatcher.isDispatching()) {
	      store.emitChange();
	    }
	  }

	  function createPrototype(proto, alt, key, extras) {
	    return fn.assign(proto, _StoreMixin2.default, {
	      displayName: key,
	      alt: alt,
	      dispatcher: alt.dispatcher,
	      preventDefault() {
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
	    StoreModel.config = fn.assign({
	      getState(state) {
	        if (Array.isArray(state)) {
	          return state.slice();
	        } else if (fn.isMutableObject(state)) {
	          return fn.assign({}, state);
	        }

	        return state;
	      },
	      setState(currentState, nextState) {
	        if (fn.isMutableObject(nextState)) {
	          return fn.assign(currentState, nextState);
	        }
	        return nextState;
	      }
	    }, globalConfig, StoreModel.config);
	  }

	  function transformStore(transforms, StoreModel) {
	    return transforms.reduce((Store, transform) => transform(Store), StoreModel);
	  }

	  function createStoreFromObject(alt, StoreModel, key) {
	    let storeInstance;

	    const StoreProto = createPrototype({}, alt, key, fn.assign({
	      getInstance() {
	        return storeInstance;
	      },
	      setState(nextState) {
	        doSetState(this, storeInstance, nextState);
	      }
	    }, StoreModel));

	    // bind the store listeners
	    /* istanbul ignore else */
	    if (StoreProto.bindListeners) {
	      _StoreMixin2.default.bindListeners.call(StoreProto, StoreProto.bindListeners);
	    }
	    /* istanbul ignore else */
	    if (StoreProto.observe) {
	      _StoreMixin2.default.bindListeners.call(StoreProto, StoreProto.observe(alt));
	    }

	    // bind the lifecycle events
	    /* istanbul ignore else */
	    if (StoreProto.lifecycle) {
	      fn.eachObject((eventName, event) => {
	        _StoreMixin2.default.on.call(StoreProto, eventName, event);
	      }, [StoreProto.lifecycle]);
	    }

	    // create the instance and fn.assign the public methods to the instance
	    storeInstance = fn.assign(new _AltStore2.default(alt, StoreProto, StoreProto.state !== undefined ? StoreProto.state : {}, StoreModel), StoreProto.publicMethods, {
	      displayName: key,
	      config: StoreModel.config
	    });

	    return storeInstance;
	  }

	  function createStoreFromClass(alt, StoreModel, key, ...argsForClass) {
	    let storeInstance;
	    const { config } = StoreModel;

	    // Creating a class here so we don't overload the provided store's
	    // prototype with the mixin behaviour and I'm extending from StoreModel
	    // so we can inherit any extensions from the provided store.
	    class Store extends StoreModel {
	      constructor(...args) {
	        super(...args);
	      }
	    }

	    createPrototype(Store.prototype, alt, key, {
	      type: 'AltStore',
	      getInstance() {
	        return storeInstance;
	      },
	      setState(nextState) {
	        doSetState(this, storeInstance, nextState);
	      }
	    });

	    const store = new Store(...argsForClass);

	    /* istanbul ignore next */
	    if (config.bindListeners) store.bindListeners(config.bindListeners);
	    /* istanbul ignore next */
	    if (config.datasource) store.registerAsync(config.datasource);

	    storeInstance = fn.assign(new _AltStore2.default(alt, store, store.state !== undefined ? store.state : store, StoreModel), utils.getInternalMethods(StoreModel), config.publicMethods, { displayName: key });

	    return storeInstance;
	  }
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('../functions'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.functions);
	    global.AltUtils = mod.exports;
	  }
	})(this, function (exports, _functions) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.getInternalMethods = getInternalMethods;
	  exports.getPrototypeChain = getPrototypeChain;
	  exports.warn = warn;
	  exports.uid = uid;
	  exports.formatAsConstant = formatAsConstant;
	  exports.dispatchIdentity = dispatchIdentity;
	  exports.fsa = fsa;
	  exports.dispatch = dispatch;

	  var fn = _interopRequireWildcard(_functions);

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  var _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  /*eslint-disable*/
	  const builtIns = Object.getOwnPropertyNames(NoopClass);
	  const builtInProto = Object.getOwnPropertyNames(NoopClass.prototype);
	  /*eslint-enable*/

	  function getInternalMethods(Obj, isProto) {
	    const excluded = isProto ? builtInProto : builtIns;
	    const obj = isProto ? Obj.prototype : Obj;
	    return Object.getOwnPropertyNames(obj).reduce((value, m) => {
	      if (excluded.indexOf(m) !== -1) {
	        return value;
	      }

	      value[m] = obj[m];
	      return value;
	    }, {});
	  }

	  function getPrototypeChain(Obj, methods = {}) {
	    return Obj === Function.prototype ? methods : getPrototypeChain(Object.getPrototypeOf(Obj), fn.assign(getInternalMethods(Obj, true), methods));
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
	    return name.replace(/[a-z]([A-Z])/g, i => {
	      return `${ i[0] }_${ i[1].toLowerCase() }`;
	    }).toUpperCase();
	  }

	  function dispatchIdentity(x, ...a) {
	    if (x === undefined) return null;
	    return a.length ? [x].concat(a) : x;
	  }

	  function fsa(id, type, payload, details) {
	    return {
	      type,
	      payload,
	      meta: _extends({
	        dispatchId: id
	      }, details),

	      id,
	      action: type,
	      data: payload,
	      details
	    };
	  }

	  function dispatch(id, actionObj, payload, alt) {
	    const data = actionObj.dispatch(payload);
	    if (data === undefined) return null;

	    const type = actionObj.id;
	    const namespace = type;
	    const name = type;
	    const details = { id: type, namespace, name };

	    const dispatchLater = x => alt.dispatch(type, x, details);

	    if (fn.isFunction(data)) return data(dispatchLater, alt);

	    // XXX standardize this
	    return alt.dispatcher.dispatch(fsa(id, type, data, details));
	  }

	  /* istanbul ignore next */
	  function NoopClass() {}
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(7), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require('../functions'), require('transmitter'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.functions, global.transmitter);
	    global.AltStore = mod.exports;
	  }
	})(this, function (module, exports, _functions, _transmitter) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var fn = _interopRequireWildcard(_functions);

	  var _transmitter2 = _interopRequireDefault(_transmitter);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  class AltStore {
	    constructor(alt, model, state, StoreModel) {
	      const lifecycleEvents = model.lifecycleEvents;
	      this.transmitter = (0, _transmitter2.default)();
	      this.lifecycle = (event, x) => {
	        if (lifecycleEvents[event]) lifecycleEvents[event].publish(x);
	      };
	      this.state = state;

	      this.alt = alt;
	      this.preventDefault = false;
	      this.displayName = model.displayName;
	      this.boundListeners = model.boundListeners;
	      this.StoreModel = StoreModel;
	      this.reduce = model.reduce || (x => x);
	      this.subscriptions = [];

	      const output = model.output || (x => x);

	      this.emitChange = () => this.transmitter.publish(output(this.state));

	      const handleDispatch = (f, payload) => {
	        try {
	          return f();
	        } catch (e) {
	          if (model.handlesOwnErrors) {
	            this.lifecycle('error', {
	              error: e,
	              payload,
	              state: this.state
	            });
	            return false;
	          }

	          throw e;
	        }
	      };

	      fn.assign(this, model.publicMethods);

	      // Register dispatcher
	      this.dispatchToken = alt.dispatcher.register(payload => {
	        this.preventDefault = false;

	        this.lifecycle('beforeEach', {
	          payload,
	          state: this.state
	        });

	        const actionHandlers = model.actionListeners[payload.action];

	        if (actionHandlers || model.otherwise) {
	          let result;

	          if (actionHandlers) {
	            result = handleDispatch(() => {
	              return actionHandlers.filter(Boolean).every(handler => {
	                return handler.call(model, payload.data, payload.action) !== false;
	              });
	            }, payload);
	          } else {
	            result = handleDispatch(() => {
	              return model.otherwise(payload.data, payload.action);
	            }, payload);
	          }

	          if (result !== false && !this.preventDefault) this.emitChange();
	        }

	        if (model.reduce) {
	          handleDispatch(() => {
	            const value = model.reduce(this.state, payload);
	            if (value !== undefined) this.state = value;
	          }, payload);
	          if (!this.preventDefault) this.emitChange();
	        }

	        this.lifecycle('afterEach', {
	          payload,
	          state: this.state
	        });
	      });

	      this.lifecycle('init');
	    }

	    listen(cb) {
	      if (!fn.isFunction(cb)) throw new TypeError('listen expects a function');
	      const { dispose } = this.transmitter.subscribe(cb);
	      this.subscriptions.push({ cb, dispose });
	      return () => {
	        this.lifecycle('unlisten');
	        dispose();
	      };
	    }

	    unlisten(cb) {
	      this.lifecycle('unlisten');
	      this.subscriptions.filter(subscription => subscription.cb === cb).forEach(subscription => subscription.dispose());
	    }

	    getState() {
	      return this.StoreModel.config.getState.call(this, this.state);
	    }
	  }

	  exports.default = AltStore;
	  module.exports = exports['default'];
	});

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

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

	module.exports = transmitter;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(11), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require('transmitter'), require('../functions'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.transmitter, global.functions);
	    global.StoreMixin = mod.exports;
	  }
	})(this, function (module, exports, _transmitter, _functions) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _transmitter2 = _interopRequireDefault(_transmitter);

	  var fn = _interopRequireWildcard(_functions);

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  const StoreMixin = {
	    waitFor(...sources) {
	      if (!sources.length) {
	        throw new ReferenceError('Dispatch tokens not provided');
	      }

	      let sourcesArray = sources;
	      if (sources.length === 1) {
	        sourcesArray = Array.isArray(sources[0]) ? sources[0] : sources;
	      }

	      const tokens = sourcesArray.map(source => {
	        return source.dispatchToken || source;
	      });

	      this.dispatcher.waitFor(tokens);
	    },

	    exportAsync(asyncMethods) {
	      this.registerAsync(asyncMethods);
	    },

	    registerAsync(asyncDef) {
	      let loadCounter = 0;

	      const asyncMethods = fn.isFunction(asyncDef) ? asyncDef(this.alt) : asyncDef;

	      const toExport = Object.keys(asyncMethods).reduce((publicMethods, methodName) => {
	        const desc = asyncMethods[methodName];
	        const spec = fn.isFunction(desc) ? desc(this) : desc;

	        const validHandlers = ['success', 'error', 'loading'];
	        validHandlers.forEach(handler => {
	          if (spec[handler] && !spec[handler].id) {
	            throw new Error(`${ handler } handler must be an action function`);
	          }
	        });

	        publicMethods[methodName] = (...args) => {
	          const state = this.getInstance().getState();
	          const value = spec.local && spec.local(state, ...args);
	          const shouldFetch = spec.shouldFetch ? spec.shouldFetch(state, ...args)
	          /*eslint-disable*/
	          : value == null;
	          /*eslint-enable*/
	          const intercept = spec.interceptResponse || (x => x);

	          const makeActionHandler = (action, isError) => {
	            return x => {
	              const fire = () => {
	                loadCounter -= 1;
	                action(intercept(x, action, args));
	                if (isError) throw x;
	                return x;
	              };
	              return this.alt.trapAsync ? () => fire() : fire();
	            };
	          };

	          // if we don't have it in cache then fetch it
	          if (shouldFetch) {
	            loadCounter += 1;
	            /* istanbul ignore else */
	            if (spec.loading) spec.loading(intercept(null, spec.loading, args));
	            return spec.remote(state, ...args).then(makeActionHandler(spec.success), makeActionHandler(spec.error, 1));
	          }

	          // otherwise emit the change now
	          this.emitChange();
	          return value;
	        };

	        return publicMethods;
	      }, {});

	      this.exportPublicMethods(toExport);
	      this.exportPublicMethods({
	        isLoading: () => loadCounter > 0
	      });
	    },

	    exportPublicMethods(methods) {
	      fn.eachObject((methodName, value) => {
	        if (!fn.isFunction(value)) {
	          throw new TypeError('exportPublicMethods expects a function');
	        }

	        this.publicMethods[methodName] = value;
	      }, [methods]);
	    },

	    emitChange() {
	      this.getInstance().emitChange();
	    },

	    on(lifecycleEvent, handler) {
	      if (lifecycleEvent === 'error') this.handlesOwnErrors = true;
	      const bus = this.lifecycleEvents[lifecycleEvent] || (0, _transmitter2.default)();
	      this.lifecycleEvents[lifecycleEvent] = bus;
	      return bus.subscribe(handler.bind(this));
	    },

	    bindAction(symbol, handler) {
	      if (!symbol) {
	        throw new ReferenceError('Invalid action reference passed in');
	      }
	      if (!fn.isFunction(handler)) {
	        throw new TypeError('bindAction expects a function');
	      }

	      // You can pass in the constant or the function itself
	      const key = symbol.id ? symbol.id : symbol;
	      this.actionListeners[key] = this.actionListeners[key] || [];
	      this.actionListeners[key].push(handler.bind(this));
	      this.boundListeners.push(key);
	    },

	    bindActions(actions) {
	      fn.eachObject((action, symbol) => {
	        const matchFirstCharacter = /./;
	        const assumedEventHandler = action.replace(matchFirstCharacter, x => {
	          return `on${ x[0].toUpperCase() }`;
	        });

	        if (this[action] && this[assumedEventHandler]) {
	          // If you have both action and onAction
	          throw new ReferenceError(`You have multiple action handlers bound to an action: ` + `${ action } and ${ assumedEventHandler }`);
	        }

	        const handler = this[action] || this[assumedEventHandler];
	        if (handler) {
	          this.bindAction(symbol, handler);
	        }
	      }, [actions]);
	    },

	    bindListeners(obj) {
	      fn.eachObject((methodName, symbol) => {
	        const listener = this[methodName];

	        if (!listener) {
	          throw new ReferenceError(`${ methodName } defined but does not exist in ${ this.displayName }`);
	        }

	        if (Array.isArray(symbol)) {
	          symbol.forEach(action => {
	            this.bindAction(action, listener);
	          });
	        } else {
	          this.bindAction(symbol, listener);
	        }
	      }, [obj]);
	    }
	  };

	  exports.default = StoreMixin;
	  module.exports = exports['default'];
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(7), __webpack_require__(9), __webpack_require__(14)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require('../functions'), require('../utils/AltUtils'), require('is-promise'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.functions, global.AltUtils, global.isPromise);
	    global.index = mod.exports;
	  }
	})(this, function (module, exports, _functions, _AltUtils, _isPromise) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = makeAction;

	  var fn = _interopRequireWildcard(_functions);

	  var utils = _interopRequireWildcard(_AltUtils);

	  var _isPromise2 = _interopRequireDefault(_isPromise);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  function makeAction(alt, namespace, name, implementation, obj) {
	    const id = utils.uid(alt._actionsRegistry, `${ namespace }.${ name }`);
	    alt._actionsRegistry[id] = 1;

	    const data = { id, namespace, name };

	    const dispatch = payload => alt.dispatch(id, payload, data);

	    // the action itself
	    const action = (...args) => {
	      let inject;
	      // check for action's implementation metadata if dispatch should be injected
	      // for example when decorated via @Reflect.metadata
	      // (https://github.com/rbuckton/ReflectDecorators#syntax)
	      if (typeof Reflect === 'object' && fn.isFunction(Reflect.getOwnMetadata)) {
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
	          args.push(dispatch);
	        }
	      }

	      const invocationResult = implementation.apply(obj, args);

	      let actionResult = invocationResult;

	      // async functions that return promises should not be dispatched
	      if (invocationResult !== undefined && !(0, _isPromise2.default)(invocationResult)) {
	        if (fn.isFunction(invocationResult)) {
	          // inner function result should be returned as an action result
	          actionResult = invocationResult(dispatch, alt);
	        } else {
	          if (!inject) {
	            dispatch(invocationResult);
	          }
	        }
	      }

	      if (invocationResult === undefined) {
	        utils.warn('An action was called but nothing was dispatched');
	      }

	      return actionResult;
	    };
	    action.defer = (...args) => setTimeout(() => action.apply(null, args));
	    action.id = id;
	    action.data = data;
	    action.dispatch = dispatch;

	    // ensure each reference is unique in the namespace
	    const container = alt.actions[namespace];
	    const namespaceId = utils.uid(container, name);
	    container[namespaceId] = action;

	    // generate a constant
	    const constant = utils.formatAsConstant(namespaceId);
	    container[constant] = id;

	    return action;
	  }
	  module.exports = exports['default'];
	});

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = isPromise;

	function isPromise(obj) {
	  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	}


/***/ }
/******/ ])
});
;