/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 79:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(3702),
    listCacheDelete = __webpack_require__(80),
    listCacheGet = __webpack_require__(4739),
    listCacheHas = __webpack_require__(8655),
    listCacheSet = __webpack_require__(1175);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ 80:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ 104:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(3661);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),

/***/ 181:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 258:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultQueryBuilder = void 0;
class DefaultQueryBuilder {
    globalStorage;
    queryOptions;
    constructor(globalStorage, queryOptions = {}) {
        this.globalStorage = globalStorage;
        this.queryOptions = queryOptions;
    }
    where(field, where) {
        return new DefaultQueryBuilder(this.globalStorage, {
            ...this.queryOptions,
            where: [
                {
                    field,
                    ...where
                }
            ]
        });
    }
    cursor(cursor) {
        return new DefaultQueryBuilder(this.globalStorage, {
            ...this.queryOptions,
            cursor
        });
    }
    limit(limit) {
        return new DefaultQueryBuilder(this.globalStorage, {
            ...this.queryOptions,
            limit
        });
    }
    async getOne() {
        const { results } = await this.limit(1).getMany();
        if (results && results.length > 0) {
            return results[0];
        }
    }
    async getMany() {
        return this.globalStorage.list(this.queryOptions);
    }
}
exports.DefaultQueryBuilder = DefaultQueryBuilder;


/***/ }),

/***/ 289:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ 290:
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");

/***/ }),

/***/ 346:
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Buffer = (__webpack_require__(2861).Buffer)

// prototype class for hash functions
function Hash (blockSize, finalSize) {
  this._block = Buffer.alloc(blockSize)
  this._finalSize = finalSize
  this._blockSize = blockSize
  this._len = 0
}

Hash.prototype.update = function (data, enc) {
  if (typeof data === 'string') {
    enc = enc || 'utf8'
    data = Buffer.from(data, enc)
  }

  var block = this._block
  var blockSize = this._blockSize
  var length = data.length
  var accum = this._len

  for (var offset = 0; offset < length;) {
    var assigned = accum % blockSize
    var remainder = Math.min(length - offset, blockSize - assigned)

    for (var i = 0; i < remainder; i++) {
      block[assigned + i] = data[offset + i]
    }

    accum += remainder
    offset += remainder

    if ((accum % blockSize) === 0) {
      this._update(block)
    }
  }

  this._len += length
  return this
}

Hash.prototype.digest = function (enc) {
  var rem = this._len % this._blockSize

  this._block[rem] = 0x80

  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
  this._block.fill(0, rem + 1)

  if (rem >= this._finalSize) {
    this._update(this._block)
    this._block.fill(0)
  }

  var bits = this._len * 8

  // uint32
  if (bits <= 0xffffffff) {
    this._block.writeUInt32BE(bits, this._blockSize - 4)

  // uint64
  } else {
    var lowBits = (bits & 0xffffffff) >>> 0
    var highBits = (bits - lowBits) / 0x100000000

    this._block.writeUInt32BE(highBits, this._blockSize - 8)
    this._block.writeUInt32BE(lowBits, this._blockSize - 4)
  }

  this._update(this._block)
  var hash = this._hash()

  return enc ? hash.toString(enc) : hash
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

module.exports = Hash


/***/ }),

/***/ 527:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isLegacyBackendEffect = exports.isLegacyRenderEffect = exports.isLegacyEventEffect = exports.isLegacyActionEffect = exports.isLegacyInitializeEffect = void 0;
const isLegacyInitializeEffect = (effect) => {
    return effect.type === 'initialize';
};
exports.isLegacyInitializeEffect = isLegacyInitializeEffect;
const isLegacyActionEffect = (effect) => {
    return effect.type === 'action';
};
exports.isLegacyActionEffect = isLegacyActionEffect;
const isLegacyEventEffect = (effect) => {
    return effect.type === 'event';
};
exports.isLegacyEventEffect = isLegacyEventEffect;
const isLegacyRenderEffect = (effect) => {
    return effect.type === 'render';
};
exports.isLegacyRenderEffect = isLegacyRenderEffect;
function isLegacyBackendEffect(effect) {
    return ((0, exports.isLegacyInitializeEffect)(effect) || (0, exports.isLegacyActionEffect)(effect) || (0, exports.isLegacyEventEffect)(effect));
}
exports.isLegacyBackendEffect = isLegacyBackendEffect;


/***/ }),

/***/ 659:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 704:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useConfig = void 0;
const tslib_1 = __webpack_require__(1635);
const reconcilerState_1 = tslib_1.__importDefault(__webpack_require__(3441));
const useConfig = () => {
    return reconcilerState_1.default.config;
};
exports.useConfig = useConfig;


/***/ }),

/***/ 1026:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomEntityBuilder = exports.CustomEntityIndexBuilder = void 0;
class CustomEntityQueryBuilder {
    globalStorage;
    queryOptions;
    constructor(globalStorage, queryOptions = {}) {
        this.globalStorage = globalStorage;
        this.queryOptions = queryOptions;
        this.queryOptions = {
            ...queryOptions
        };
    }
    clone(overrides) {
        return new (Object.getPrototypeOf(this).constructor)(this.globalStorage, {
            ...this.queryOptions,
            ...overrides
        });
    }
    where(condition) {
        return this.clone({
            range: {
                ...condition
            }
        });
    }
    sort(sort) {
        return this.clone({
            sort
        });
    }
    cursor(cursor) {
        return this.clone({
            cursor
        });
    }
    limit(limit) {
        return this.clone({
            limit
        });
    }
    async getOne() {
        const { results } = await this.limit(1).getMany();
        return results?.[0];
    }
    async getMany() {
        if (!this.queryOptions.entityName) {
            throw new Error('entityName is mandatory');
        }
        if (!this.queryOptions.indexName) {
            throw new Error('indexName is mandatory');
        }
        const queryOptions = { ...this.queryOptions };
        if (!queryOptions.filterOperator && queryOptions.filters) {
            queryOptions.filterOperator = 'and';
        }
        return this.globalStorage.listCustomEntities(this.queryOptions);
    }
}
class CustomEntityAndFilterQueryBuilder extends CustomEntityQueryBuilder {
    globalStorage;
    queryOptions;
    constructor(globalStorage, queryOptions = {}) {
        super(globalStorage, queryOptions);
        this.globalStorage = globalStorage;
        this.queryOptions = queryOptions;
        this.queryOptions = {
            ...queryOptions
        };
    }
    andFilter(field, condition) {
        const newQueryOptions = {
            ...this.queryOptions
        };
        newQueryOptions.filters = [...(this.queryOptions.filters ?? []), { property: field, ...condition }];
        newQueryOptions.filterOperator = 'and';
        return new CustomEntityAndFilterQueryBuilder(this.globalStorage, newQueryOptions);
    }
}
class CustomEntityOrFilterQueryBuilder extends CustomEntityQueryBuilder {
    globalStorage;
    queryOptions;
    constructor(globalStorage, queryOptions = {}) {
        super(globalStorage, queryOptions);
        this.globalStorage = globalStorage;
        this.queryOptions = queryOptions;
        this.queryOptions = {
            ...queryOptions
        };
    }
    orFilter(field, condition) {
        const newQueryOptions = {
            ...this.queryOptions
        };
        newQueryOptions.filters = [...(this.queryOptions.filters ?? []), { property: field, ...condition }];
        newQueryOptions.filterOperator = 'or';
        return new CustomEntityOrFilterQueryBuilder(this.globalStorage, newQueryOptions);
    }
}
class CustomEntityFilterQueryBuilder extends CustomEntityQueryBuilder {
    globalStorage;
    queryOptions;
    constructor(globalStorage, queryOptions = {}) {
        super(globalStorage, queryOptions);
        this.globalStorage = globalStorage;
        this.queryOptions = queryOptions;
        this.queryOptions = {
            ...queryOptions
        };
    }
    andFilter(field, condition) {
        return new CustomEntityAndFilterQueryBuilder(this.globalStorage, this.queryOptions).andFilter(field, condition);
    }
    orFilter(field, condition) {
        return new CustomEntityOrFilterQueryBuilder(this.globalStorage, this.queryOptions).orFilter(field, condition);
    }
}
class CustomEntityIndexBuilder {
    globalStorage;
    queryOptions;
    constructor(globalStorage, queryOptions = {}) {
        this.globalStorage = globalStorage;
        this.queryOptions = queryOptions;
        this.queryOptions = {
            ...queryOptions
        };
    }
    index(name, indexOptions) {
        const indexProperties = indexOptions ? { indexName: name, ...indexOptions } : { indexName: name };
        return new CustomEntityFilterQueryBuilder(this.globalStorage, {
            ...this.queryOptions,
            ...indexProperties
        });
    }
}
exports.CustomEntityIndexBuilder = CustomEntityIndexBuilder;
class CustomEntityBuilder {
    globalStorage;
    queryOptions;
    constructor(globalStorage, queryOptions = {}) {
        this.globalStorage = globalStorage;
        this.queryOptions = queryOptions;
        this.queryOptions = {
            ...queryOptions
        };
    }
    entity(name) {
        return new CustomEntityIndexBuilder(this.globalStorage, {
            ...this.queryOptions,
            entityName: name
        });
    }
}
exports.CustomEntityBuilder = CustomEntityBuilder;


/***/ }),

/***/ 1042:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 1100:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Translator = void 0;
const translationValueGetter_1 = __webpack_require__(1813);
class Translator {
    locale;
    translationsGetter;
    localeLookupOrderedTranslations = null;
    cache = new Map();
    constructor(locale, translationsGetter) {
        this.locale = locale;
        this.translationsGetter = translationsGetter;
    }
    async init() {
        this.localeLookupOrderedTranslations = await this.translationsGetter.getTranslationsByLocaleLookupOrder(this.locale);
    }
    translate(i18nKey) {
        if (!this.localeLookupOrderedTranslations) {
            throw new Error('TranslationLookup not initialized');
        }
        let result = this.cache.get(i18nKey);
        if (result === undefined) {
            for (const { translations } of this.localeLookupOrderedTranslations) {
                const translationValue = (0, translationValueGetter_1.getTranslationValueFromContent)(translations, i18nKey);
                if (translationValue !== null) {
                    result = translationValue;
                    break;
                }
            }
            result = result ?? null;
            this.cache.set(i18nKey, result);
        }
        return result;
    }
}
exports.Translator = Translator;


/***/ }),

/***/ 1175:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ 1228:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assumeTrustedRoute = exports.requireSafeUrl = exports.route = exports.routeFromAbsolute = exports.isRoute = void 0;
class ReadonlyRoute {
    value_;
    constructor(value_) {
        this.value_ = value_;
    }
    set value(_) {
        throw new Error('modification of a Route is not allowed');
    }
    get value() {
        return this.value_;
    }
}
function isRoute(x) {
    return x instanceof ReadonlyRoute;
}
exports.isRoute = isRoute;
function routeFromAbsolute(absolutePath) {
    const absoluteURL = new URL(absolutePath);
    return assumeTrustedRoute(`${absoluteURL.pathname}${absoluteURL.search}`);
}
exports.routeFromAbsolute = routeFromAbsolute;
const DOUBLE_DOT = ['..', '.%2e', '%2e.', '%2e%2e', '.%2E', '%2E.', '%2E%2e'];
const DIRECTORY_PATH = ['/', '\\'];
const ENDS_PATH = ['?', '#'];
function containsOneOf(needles, haystack) {
    return needles.some((needle) => haystack.includes(needle));
}
function escapeParameter(parameter, mode) {
    switch (mode) {
        case 'path':
            if (isRoute(parameter)) {
                return parameter.value;
            }
            parameter = String(parameter);
            if (containsOneOf(DOUBLE_DOT, parameter) ||
                containsOneOf(ENDS_PATH, parameter) ||
                containsOneOf(DIRECTORY_PATH, parameter)) {
                throw new Error('Disallowing path manipulation attempt. For more information see: https://go.atlassian.com/product-fetch-api-route');
            }
            return parameter;
        case 'query':
            if (isRoute(parameter)) {
                return encodeURIComponent(parameter.value);
            }
            else if (parameter instanceof URLSearchParams) {
                return parameter.toString();
            }
            else {
                return encodeURIComponent(parameter);
            }
    }
}
function route(template, ...parameters) {
    let mode = 'path';
    let result = '';
    for (let i = 0; i < template.length; i++) {
        const templateFragment = template[i];
        if (containsOneOf(ENDS_PATH, templateFragment)) {
            mode = 'query';
        }
        result += templateFragment;
        if (i >= parameters.length) {
            break;
        }
        result += escapeParameter(parameters[i], mode);
    }
    return new ReadonlyRoute(result);
}
exports.route = route;
function requireSafeUrl(url) {
    if (url instanceof ReadonlyRoute) {
        return url;
    }
    throw new Error(`You must create your route using the 'route' export from '@forge/api'.
See https://go.atlassian.com/forge-fetch-route for more information.`);
}
exports.requireSafeUrl = requireSafeUrl;
function assumeTrustedRoute(route) {
    return new ReadonlyRoute(route);
}
exports.assumeTrustedRoute = assumeTrustedRoute;


/***/ }),

/***/ 1317:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createReportPersonalData = exports.LIMIT = exports.URL = void 0;
exports.URL = '/app/report-accounts';
exports.LIMIT = 90;
const createReportPersonalData = (requestAtlassian) => {
    return function fetchUpdates(accounts) {
        if (accounts.length === 0) {
            return Promise.resolve([]);
        }
        const request = requestAtlassian(exports.URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ accounts: accounts.slice(0, exports.LIMIT) })
        }).then(async (resp) => {
            if (resp.status === 200) {
                return (await resp.json()).accounts;
            }
            if (resp.status === 204) {
                return [];
            }
            return Promise.reject(resp);
        });
        return Promise.all([request, fetchUpdates(accounts.slice(exports.LIMIT))]).then(([first, second]) => first.concat(second));
    };
};
exports.createReportPersonalData = createReportPersonalData;


/***/ }),

/***/ 1352:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useProductContext = void 0;
const tslib_1 = __webpack_require__(1635);
const reconcilerState_1 = tslib_1.__importDefault(__webpack_require__(3441));
const useProductContext = () => reconcilerState_1.default.productContext;
exports.useProductContext = useProductContext;


/***/ }),

/***/ 1549:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(2032),
    hashDelete = __webpack_require__(3862),
    hashGet = __webpack_require__(6721),
    hashHas = __webpack_require__(2749),
    hashSet = __webpack_require__(5749);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ 1635:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
  function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose;
    if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  function next() {
    while (env.stack.length) {
      var rec = env.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
      }
      catch (e) {
          fail(e);
      }
    }
    if (env.hasError) throw env.error;
  }
  return next();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
});


/***/ }),

/***/ 1665:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashDependencies = void 0;
const tslib_1 = __webpack_require__(1635);
const fast_json_stable_stringify_1 = tslib_1.__importDefault(__webpack_require__(2492));
const sha_js_1 = tslib_1.__importDefault(__webpack_require__(2802));
const hashDependencies = (values) => (0, sha_js_1.default)('sha256')
    .update((0, fast_json_stable_stringify_1.default)(values))
    .digest('hex');
exports.hashDependencies = hashDependencies;


/***/ }),

/***/ 1769:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(6449),
    isKey = __webpack_require__(8586),
    stringToPath = __webpack_require__(1802),
    toString = __webpack_require__(3222);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),

/***/ 1802:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoizeCapped = __webpack_require__(2224);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ 1813:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTranslationValueFromContent = exports.getTranslationValue = void 0;
const tslib_1 = __webpack_require__(1635);
const get_1 = tslib_1.__importDefault(__webpack_require__(8156));
const getTranslationValue = (translationLookup, i18nKey, locale) => {
    const translation = translationLookup[locale];
    if (!translation) {
        return null;
    }
    return (0, exports.getTranslationValueFromContent)(translation, i18nKey);
};
exports.getTranslationValue = getTranslationValue;
const getTranslationValueFromContent = (translationContent, i18nKey) => {
    let translationValue = translationContent[i18nKey];
    if (!translationValue) {
        const keyTokens = i18nKey.split('.');
        if (keyTokens.length > 1) {
            translationValue = (0, get_1.default)(translationContent, keyTokens, null);
        }
    }
    return typeof translationValue === 'string' ? translationValue : null;
};
exports.getTranslationValueFromContent = getTranslationValueFromContent;


/***/ }),

/***/ 1873:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 1882:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isObject = __webpack_require__(3805);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ 2017:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

try {
  var util = __webpack_require__(9023);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(6698);
}


/***/ }),

/***/ 2026:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isCustomFieldExtensionContext = exports.isContentActionExtensionContext = exports.isContextMenuExtensionContext = exports.isIssuePanelExtensionContext = exports.isJiraContext = exports.useEffect = exports.useConfig = exports.useProductContext = exports.useState = exports.useAction = exports.render = void 0;
const tslib_1 = __webpack_require__(1635);
function createElement(type, props, ...children) {
    const element = {
        key: null,
        props: {
            ...props,
            children: children.reduce((flattened, child) => {
                if (child || typeof child === 'number') {
                    return flattened.concat(child);
                }
                return flattened;
            }, [])
        }
    };
    if (typeof type === 'string') {
        return {
            type,
            ...element
        };
    }
    return {
        type,
        ...element
    };
}
var backend_runtime_1 = __webpack_require__(7871);
Object.defineProperty(exports, "render", ({ enumerable: true, get: function () { return backend_runtime_1.render; } }));
var useAction_1 = __webpack_require__(8344);
Object.defineProperty(exports, "useAction", ({ enumerable: true, get: function () { return useAction_1.useAction; } }));
var useState_1 = __webpack_require__(6637);
Object.defineProperty(exports, "useState", ({ enumerable: true, get: function () { return useState_1.useState; } }));
var useProductContext_1 = __webpack_require__(1352);
Object.defineProperty(exports, "useProductContext", ({ enumerable: true, get: function () { return useProductContext_1.useProductContext; } }));
var useConfig_1 = __webpack_require__(704);
Object.defineProperty(exports, "useConfig", ({ enumerable: true, get: function () { return useConfig_1.useConfig; } }));
var useEffect_1 = __webpack_require__(6583);
Object.defineProperty(exports, "useEffect", ({ enumerable: true, get: function () { return useEffect_1.useEffect; } }));
var types_1 = __webpack_require__(2928);
Object.defineProperty(exports, "isJiraContext", ({ enumerable: true, get: function () { return types_1.isJiraContext; } }));
Object.defineProperty(exports, "isIssuePanelExtensionContext", ({ enumerable: true, get: function () { return types_1.isIssuePanelExtensionContext; } }));
Object.defineProperty(exports, "isContextMenuExtensionContext", ({ enumerable: true, get: function () { return types_1.isContextMenuExtensionContext; } }));
Object.defineProperty(exports, "isContentActionExtensionContext", ({ enumerable: true, get: function () { return types_1.isContentActionExtensionContext; } }));
Object.defineProperty(exports, "isCustomFieldExtensionContext", ({ enumerable: true, get: function () { return types_1.isCustomFieldExtensionContext; } }));
tslib_1.__exportStar(__webpack_require__(7588), exports);
tslib_1.__exportStar(__webpack_require__(7131), exports);
exports["default"] = { createElement };


/***/ }),

/***/ 2032:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ 2167:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInstallationAri = exports.getEnvironmentAri = exports.getAppAri = void 0;
const getAppAri = (appId) => ({
    appId,
    toString: () => `ari:cloud:ecosystem::app/${appId}`,
    toJSON: () => `ari:cloud:ecosystem::app/${appId}`
});
exports.getAppAri = getAppAri;
const getEnvironmentAri = (appId, environmentId) => ({
    environmentId,
    toString: () => `ari:cloud:ecosystem::environment/${appId}/${environmentId}`,
    toJSON: () => `ari:cloud:ecosystem::environment/${appId}/${environmentId}`
});
exports.getEnvironmentAri = getEnvironmentAri;
const getInstallationAri = (installationId) => ({
    installationId,
    toString: () => `ari:cloud:ecosystem::installation/${installationId}`,
    toJSON: () => `ari:cloud:ecosystem::installation/${installationId}`
});
exports.getInstallationAri = getInstallationAri;


/***/ }),

/***/ 2224:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoize = __webpack_require__(104);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ 2275:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityStorageBuilder = void 0;
var storage_builder_1 = __webpack_require__(7560);
Object.defineProperty(exports, "EntityStorageBuilder", ({ enumerable: true, get: function () { return storage_builder_1.EntityStorageBuilder; } }));


/***/ }),

/***/ 2382:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const api_1 = __webpack_require__(7274);
const isRequestPayload = (request) => {
    return typeof request.payload === 'object' && request.payload.product && request.payload.fetchUrl;
};
const defaultFunctions = {
    __request: async (request) => {
        if (!isRequestPayload(request)) {
            throw new Error('Invalid payload specified for request');
        }
        const { payload } = request;
        const productApis = {
            jira: (0, api_1.asUser)().requestJira,
            confluence: (0, api_1.asUser)().requestConfluence
        };
        const response = await productApis[payload.product]((0, api_1.assumeTrustedRoute)(payload.fetchUrl), payload.fetchOptions);
        let body = await response.text();
        try {
            body = JSON.parse(body);
        }
        catch (e) { }
        return { ...response, body };
    }
};
class Resolver {
    functions;
    constructor() {
        this.functions = {
            ...defaultFunctions
        };
    }
    define(functionKey, cb) {
        if (!cb || typeof cb !== 'function') {
            throw new Error(`Resolver definition '${functionKey}' callback must be a 'function'. Received '${typeof cb}'.`);
        }
        if (functionKey in this.functions) {
            throw new Error(`Resolver definition '${functionKey}' already exists.`);
        }
        this.functions[functionKey] = cb;
        return this;
    }
    getFunction(functionKey) {
        if (functionKey in this.functions) {
            return this.functions[functionKey];
        }
        throw new Error(`Resolver has no definition for '${functionKey}'.`);
    }
    sanitizeObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
    getDefinitions() {
        const resolve = async ({ call: { functionKey, payload: callPayload, jobId }, context }, backendRuntimePayload) => {
            const cb = this.getFunction(functionKey);
            const result = await cb({
                payload: callPayload || {},
                context: {
                    ...context,
                    installContext: backendRuntimePayload?.installContext,
                    accountId: backendRuntimePayload?.principal?.accountId,
                    license: backendRuntimePayload?.license,
                    jobId: jobId,
                    installation: backendRuntimePayload?.installation
                }
            });
            if (typeof result === 'object') {
                return this.sanitizeObject(result);
            }
            return result;
        };
        return resolve;
    }
}
exports.A = Resolver;


/***/ }),

/***/ 2391:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.invokeRemote = void 0;
const errors_1 = __webpack_require__(9742);
const fetch_1 = __webpack_require__(8265);
async function invokeRemote(remoteKey, options) {
    const { path, ...fetchOptions } = options;
    if (!remoteKey) {
        throw new Error('Missing remote key provided to invokeRemote');
    }
    if (!path) {
        throw new Error('Missing or empty path provided to invokeRemote');
    }
    const response = await global.__forge_fetch__({
        type: 'frc',
        remote: remoteKey
    }, path, fetchOptions);
    handleResponseErrors(response, remoteKey);
    return response;
}
exports.invokeRemote = invokeRemote;
function handleResponseErrors(response, remoteKey) {
    const forgeProxyError = (0, fetch_1.getForgeProxyError)(response);
    if (forgeProxyError === 'INVALID_REMOTE') {
        throw new errors_1.InvalidRemoteError(`Invalid remote key provided: "${remoteKey}"`, remoteKey);
    }
    (0, fetch_1.handleProxyResponseErrors)(response);
}


/***/ }),

/***/ 2492:
/***/ ((module) => {

"use strict";


module.exports = function (data, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'function') opts = { cmp: opts };
    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;

    var cmp = opts.cmp && (function (f) {
        return function (node) {
            return function (a, b) {
                var aobj = { key: a, value: node[a] };
                var bobj = { key: b, value: node[b] };
                return f(aobj, bobj);
            };
        };
    })(opts.cmp);

    var seen = [];
    return (function stringify (node) {
        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        if (node === undefined) return;
        if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
        if (typeof node !== 'object') return JSON.stringify(node);

        var i, out;
        if (Array.isArray(node)) {
            out = '[';
            for (i = 0; i < node.length; i++) {
                if (i) out += ',';
                out += stringify(node[i]) || 'null';
            }
            return out + ']';
        }

        if (node === null) return 'null';

        if (seen.indexOf(node) !== -1) {
            if (cycles) return JSON.stringify('__cycle__');
            throw new TypeError('Converting circular structure to JSON');
        }

        var seenIndex = seen.push(node) - 1;
        var keys = Object.keys(node).sort(cmp && cmp(node));
        out = '';
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = stringify(node[key]);

            if (!value) continue;
            if (out) out += ',';
            out += JSON.stringify(key) + ':' + value;
        }
        seen.splice(seenIndex, 1);
        return '{' + out + '}';
    })(data);
};


/***/ }),

/***/ 2552:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873),
    getRawTag = __webpack_require__(659),
    objectToString = __webpack_require__(9350);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 2651:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(4218);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ 2749:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ 2802:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = __webpack_require__(7816)
exports.sha1 = __webpack_require__(3737)
exports.sha224 = __webpack_require__(6710)
exports.sha256 = __webpack_require__(4107)
exports.sha384 = __webpack_require__(2827)
exports.sha512 = __webpack_require__(2890)


/***/ }),

/***/ 2827:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var inherits = __webpack_require__(2017)
var SHA512 = __webpack_require__(2890)
var Hash = __webpack_require__(392)
var Buffer = (__webpack_require__(2861).Buffer)

var W = new Array(160)

function Sha384 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha384, SHA512)

Sha384.prototype.init = function () {
  this._ah = 0xcbbb9d5d
  this._bh = 0x629a292a
  this._ch = 0x9159015a
  this._dh = 0x152fecd8
  this._eh = 0x67332667
  this._fh = 0x8eb44a87
  this._gh = 0xdb0c2e0d
  this._hh = 0x47b5481d

  this._al = 0xc1059ed8
  this._bl = 0x367cd507
  this._cl = 0x3070dd17
  this._dl = 0xf70e5939
  this._el = 0xffc00b31
  this._fl = 0x68581511
  this._gl = 0x64f98fa7
  this._hl = 0xbefa4fa4

  return this
}

Sha384.prototype._hash = function () {
  var H = Buffer.allocUnsafe(48)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)

  return H
}

module.exports = Sha384


/***/ }),

/***/ 2861:
/***/ ((module, exports, __webpack_require__) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(181)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ 2890:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var inherits = __webpack_require__(2017)
var Hash = __webpack_require__(392)
var Buffer = (__webpack_require__(2861).Buffer)

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
]

var W = new Array(160)

function Sha512 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha512, Hash)

Sha512.prototype.init = function () {
  this._ah = 0x6a09e667
  this._bh = 0xbb67ae85
  this._ch = 0x3c6ef372
  this._dh = 0xa54ff53a
  this._eh = 0x510e527f
  this._fh = 0x9b05688c
  this._gh = 0x1f83d9ab
  this._hh = 0x5be0cd19

  this._al = 0xf3bcc908
  this._bl = 0x84caa73b
  this._cl = 0xfe94f82b
  this._dl = 0x5f1d36f1
  this._el = 0xade682d1
  this._fl = 0x2b3e6c1f
  this._gl = 0xfb41bd6b
  this._hl = 0x137e2179

  return this
}

function Ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x, xl) {
  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
}

function sigma1 (x, xl) {
  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
}

function Gamma0 (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
}

function Gamma0l (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
}

function Gamma1 (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
}

function Gamma1l (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
}

function getCarry (a, b) {
  return (a >>> 0) < (b >>> 0) ? 1 : 0
}

Sha512.prototype._update = function (M) {
  var W = this._w

  var ah = this._ah | 0
  var bh = this._bh | 0
  var ch = this._ch | 0
  var dh = this._dh | 0
  var eh = this._eh | 0
  var fh = this._fh | 0
  var gh = this._gh | 0
  var hh = this._hh | 0

  var al = this._al | 0
  var bl = this._bl | 0
  var cl = this._cl | 0
  var dl = this._dl | 0
  var el = this._el | 0
  var fl = this._fl | 0
  var gl = this._gl | 0
  var hl = this._hl | 0

  for (var i = 0; i < 32; i += 2) {
    W[i] = M.readInt32BE(i * 4)
    W[i + 1] = M.readInt32BE(i * 4 + 4)
  }
  for (; i < 160; i += 2) {
    var xh = W[i - 15 * 2]
    var xl = W[i - 15 * 2 + 1]
    var gamma0 = Gamma0(xh, xl)
    var gamma0l = Gamma0l(xl, xh)

    xh = W[i - 2 * 2]
    xl = W[i - 2 * 2 + 1]
    var gamma1 = Gamma1(xh, xl)
    var gamma1l = Gamma1l(xl, xh)

    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
    var Wi7h = W[i - 7 * 2]
    var Wi7l = W[i - 7 * 2 + 1]

    var Wi16h = W[i - 16 * 2]
    var Wi16l = W[i - 16 * 2 + 1]

    var Wil = (gamma0l + Wi7l) | 0
    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0
    Wil = (Wil + gamma1l) | 0
    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0
    Wil = (Wil + Wi16l) | 0
    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0

    W[i] = Wih
    W[i + 1] = Wil
  }

  for (var j = 0; j < 160; j += 2) {
    Wih = W[j]
    Wil = W[j + 1]

    var majh = maj(ah, bh, ch)
    var majl = maj(al, bl, cl)

    var sigma0h = sigma0(ah, al)
    var sigma0l = sigma0(al, ah)
    var sigma1h = sigma1(eh, el)
    var sigma1l = sigma1(el, eh)

    // t1 = h + sigma1 + ch + K[j] + W[j]
    var Kih = K[j]
    var Kil = K[j + 1]

    var chh = Ch(eh, fh, gh)
    var chl = Ch(el, fl, gl)

    var t1l = (hl + sigma1l) | 0
    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0
    t1l = (t1l + chl) | 0
    t1h = (t1h + chh + getCarry(t1l, chl)) | 0
    t1l = (t1l + Kil) | 0
    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0
    t1l = (t1l + Wil) | 0
    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0

    // t2 = sigma0 + maj
    var t2l = (sigma0l + majl) | 0
    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0

    hh = gh
    hl = gl
    gh = fh
    gl = fl
    fh = eh
    fl = el
    el = (dl + t1l) | 0
    eh = (dh + t1h + getCarry(el, dl)) | 0
    dh = ch
    dl = cl
    ch = bh
    cl = bl
    bh = ah
    bl = al
    al = (t1l + t2l) | 0
    ah = (t1h + t2h + getCarry(al, t1l)) | 0
  }

  this._al = (this._al + al) | 0
  this._bl = (this._bl + bl) | 0
  this._cl = (this._cl + cl) | 0
  this._dl = (this._dl + dl) | 0
  this._el = (this._el + el) | 0
  this._fl = (this._fl + fl) | 0
  this._gl = (this._gl + gl) | 0
  this._hl = (this._hl + hl) | 0

  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0
  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0
  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0
  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0
  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0
  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0
  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0
  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0
}

Sha512.prototype._hash = function () {
  var H = Buffer.allocUnsafe(64)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)
  writeInt64BE(this._gh, this._gl, 48)
  writeInt64BE(this._hh, this._hl, 56)

  return H
}

module.exports = Sha512


/***/ }),

/***/ 2928:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isDashboardGadgetExtensionContext = exports.isCustomFieldExtensionContext = exports.isCustomFieldContextConfigExtensionContext = exports.isIssuePanelExtensionContext = exports.isJiraContext = exports.isForgeElement = exports.isContextMenuExtensionContext = exports.isContentActionExtensionContext = exports.CompassContextTypes = exports.isResultEffect = exports.isRenderEffect = exports.isEventEffect = exports.isBackendEffect = exports.isActionEffect = exports.isLegacyRenderEffect = exports.isLegacyInitializeEffect = exports.isLegacyEventEffect = exports.isLegacyBackendEffect = exports.isLegacyActionEffect = void 0;
var legacy_effect_1 = __webpack_require__(527);
Object.defineProperty(exports, "isLegacyActionEffect", ({ enumerable: true, get: function () { return legacy_effect_1.isLegacyActionEffect; } }));
Object.defineProperty(exports, "isLegacyBackendEffect", ({ enumerable: true, get: function () { return legacy_effect_1.isLegacyBackendEffect; } }));
Object.defineProperty(exports, "isLegacyEventEffect", ({ enumerable: true, get: function () { return legacy_effect_1.isLegacyEventEffect; } }));
Object.defineProperty(exports, "isLegacyInitializeEffect", ({ enumerable: true, get: function () { return legacy_effect_1.isLegacyInitializeEffect; } }));
Object.defineProperty(exports, "isLegacyRenderEffect", ({ enumerable: true, get: function () { return legacy_effect_1.isLegacyRenderEffect; } }));
var effect_1 = __webpack_require__(5139);
Object.defineProperty(exports, "isActionEffect", ({ enumerable: true, get: function () { return effect_1.isActionEffect; } }));
Object.defineProperty(exports, "isBackendEffect", ({ enumerable: true, get: function () { return effect_1.isBackendEffect; } }));
Object.defineProperty(exports, "isEventEffect", ({ enumerable: true, get: function () { return effect_1.isEventEffect; } }));
Object.defineProperty(exports, "isRenderEffect", ({ enumerable: true, get: function () { return effect_1.isRenderEffect; } }));
Object.defineProperty(exports, "isResultEffect", ({ enumerable: true, get: function () { return effect_1.isResultEffect; } }));
var forge_1 = __webpack_require__(6679);
Object.defineProperty(exports, "CompassContextTypes", ({ enumerable: true, get: function () { return forge_1.CompassContextTypes; } }));
Object.defineProperty(exports, "isContentActionExtensionContext", ({ enumerable: true, get: function () { return forge_1.isContentActionExtensionContext; } }));
Object.defineProperty(exports, "isContextMenuExtensionContext", ({ enumerable: true, get: function () { return forge_1.isContextMenuExtensionContext; } }));
Object.defineProperty(exports, "isForgeElement", ({ enumerable: true, get: function () { return forge_1.isForgeElement; } }));
Object.defineProperty(exports, "isJiraContext", ({ enumerable: true, get: function () { return forge_1.isJiraContext; } }));
Object.defineProperty(exports, "isIssuePanelExtensionContext", ({ enumerable: true, get: function () { return forge_1.isIssuePanelExtensionContext; } }));
Object.defineProperty(exports, "isCustomFieldContextConfigExtensionContext", ({ enumerable: true, get: function () { return forge_1.isCustomFieldContextConfigExtensionContext; } }));
Object.defineProperty(exports, "isCustomFieldExtensionContext", ({ enumerable: true, get: function () { return forge_1.isCustomFieldExtensionContext; } }));
Object.defineProperty(exports, "isDashboardGadgetExtensionContext", ({ enumerable: true, get: function () { return forge_1.isDashboardGadgetExtensionContext; } }));


/***/ }),

/***/ 2949:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ 3040:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(1549),
    ListCache = __webpack_require__(79),
    Map = __webpack_require__(8223);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ 3122:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomEntityQueries = exports.UntypedQueries = void 0;
class UntypedQueries {
    static get = (key, encrypted) => ({
        query: `
      query forge_app_getApplicationStorageEntity($key: ID!, $encrypted: Boolean!) {
        appStoredEntity(key: $key, encrypted: $encrypted) {
          key
          value
        }
      }
    `,
        variables: {
            key,
            encrypted
        }
    });
    static set = (key, value, encrypted) => ({
        query: `
      mutation forge_app_setApplicationStorageEntity($input: SetAppStoredEntityMutationInput!) {
        appStorage{
          setAppStoredEntity(input: $input) {
            success

            errors {
              message
              extensions {
                errorType
                statusCode
              }
            }
          }
        }
      }
    `,
        variables: {
            input: {
                key,
                value,
                encrypted
            }
        }
    });
    static delete = (key, encrypted) => ({
        query: `
      mutation forge_app_deleteApplicationStorageEntity($input: DeleteAppStoredEntityMutationInput!) {
        appStorage {
          deleteAppStoredEntity(input: $input) {
            success
  
            errors {
              message
              extensions {
                errorType
                statusCode
              }
            }
          }
        }
      }
    `,
        variables: {
            input: {
                key,
                encrypted
            }
        }
    });
    static listQuery = (options) => ({
        query: `
      query forge_app_getApplicationStorageEntities($where: [AppStoredEntityFilter!], $cursor: String, $limit: Int) {
        appStoredEntities(where: $where, after: $cursor, first: $limit) {
          edges {
            node {
              value
              key
            }
  
            cursor
          }
        }
      }
    `,
        variables: {
            where: options.where ?? null,
            cursor: options.cursor ?? null,
            limit: options.limit ?? null
        }
    });
}
exports.UntypedQueries = UntypedQueries;
class CustomEntityQueries {
    static get = (entityName, key) => ({
        query: `
    query forge_app_getApplicationStorageCustomEntity ($key: ID!, $entityName: String!) {
      appStoredCustomEntity(key: $key, entityName: $entityName) {
          value
          entityName
          key
      }
  }
    `,
        variables: {
            entityName,
            key
        }
    });
    static set = (entityName, key, value) => ({
        query: `
      mutation forge_app_setApplicationStorageCustomEntity($input: SetAppStoredCustomEntityMutationInput!) {
        appStorageCustomEntity{
          setAppStoredCustomEntity(input: $input) {
            success
  
            errors {
              message
              extensions {
                errorType
                statusCode
              }
            }
          }
        }
      }
    `,
        variables: {
            input: {
                entityName,
                key,
                value
            }
        }
    });
    static delete = (entityName, key) => ({
        query: `
      mutation forge_app_deleteApplicationStorageCustomEntity($input: DeleteAppStoredCustomEntityMutationInput!) {
        appStorageCustomEntity {
          deleteAppStoredCustomEntity(input: $input) {
            success
  
            errors {
              message
              extensions {
                errorType
                statusCode
              }
            }
          }
        }
      }
    `,
        variables: {
            input: {
                entityName,
                key
            }
        }
    });
    static listQuery = (options) => {
        return {
            query: `
      query AppStorageCustomEntityQueries ($entityName: String!, $indexName: String!, $range: AppStoredCustomEntityRange, $filters: AppStoredCustomEntityFilters, $sort:SortOrder, $limit: Int, $cursor: String, $partition: [AppStoredCustomEntityFieldValue!]) {
        appStoredCustomEntities(entityName: $entityName, indexName: $indexName, range: $range, filters: $filters, sort:$sort, limit: $limit, cursor: $cursor, partition: $partition) {
            edges {
                node {
                    key
                    value
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
            totalCount
            cursor
        }
  } 
      `,
            variables: {
                entityName: options.entityName,
                indexName: options.indexName,
                range: options.range,
                ...(options.filters && options.filters.length
                    ? {
                        filters: {
                            [options.filterOperator || 'and']: options.filters
                        }
                    }
                    : {}),
                ...(options.partition ? { partition: options.partition } : {}),
                ...(options.sort ? { sort: options.sort } : {}),
                ...(options.cursor ? { cursor: options.cursor } : {}),
                ...(options.limit ? { limit: options.limit } : {})
            }
        };
    };
}
exports.CustomEntityQueries = CustomEntityQueries;


/***/ }),

/***/ 3222:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseToString = __webpack_require__(7556);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ 3318:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authorizeJiraWithFetch = exports.authorizeConfluenceWithFetch = void 0;
var confluence_1 = __webpack_require__(3445);
Object.defineProperty(exports, "authorizeConfluenceWithFetch", ({ enumerable: true, get: function () { return confluence_1.authorizeConfluenceWithFetch; } }));
var jira_1 = __webpack_require__(3743);
Object.defineProperty(exports, "authorizeJiraWithFetch", ({ enumerable: true, get: function () { return jira_1.authorizeJiraWithFetch; } }));


/***/ }),

/***/ 3441:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReconcilerState = void 0;
class ReconcilerState {
    constructor() {
        this._queueEnabled = false;
        this._queuedSideEffects = [];
        this._productContext = {};
        this._config = undefined;
    }
    get wipFiber() {
        if (!this._wipFiber) {
            throw new Error('cannot use a hook outside of a component');
        }
        return this._wipFiber;
    }
    set wipFiber(fiber) {
        this._wipFiber = fiber;
    }
    clearWipFiber() {
        this._wipFiber = undefined;
    }
    get currentEffect() {
        if (!this._currentEffect) {
            throw new Error('this hook cannot run outside of an effect');
        }
        return this._currentEffect;
    }
    set currentEffect(effect) {
        this._currentEffect = effect;
    }
    get previousState() {
        if (!this._previousState) {
            throw new Error('action effects must be run with previous state');
        }
        return this._previousState;
    }
    set previousState(state) {
        this._previousState = state;
    }
    get productContext() {
        return this._productContext;
    }
    set productContext(context) {
        this._productContext = context;
    }
    get config() {
        return this._config;
    }
    set config(config) {
        this._config = config;
    }
    get queuedSideEffects() {
        return this._queuedSideEffects;
    }
    clearSideEffectsQueue() {
        this._queuedSideEffects = [];
    }
    enableSideEffectsQueue() {
        this._queueEnabled = true;
    }
    disableSideEffectsQueue() {
        this._queueEnabled = false;
    }
    enqueueSideEffectIfEnabled(effect) {
        if (!this._queueEnabled) {
            throw new Error('dispatch must be called inside of an event handler or within the function arguments of useAction, useState or useContentProperty');
        }
        this._queuedSideEffects.push(effect);
    }
}
exports.ReconcilerState = ReconcilerState;
exports["default"] = new ReconcilerState();


/***/ }),

/***/ 3445:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authorizeConfluenceWithFetch = void 0;
const tslib_1 = __webpack_require__(1635);
const api_1 = __webpack_require__(3534);
const permissions_1 = tslib_1.__importDefault(__webpack_require__(8393));
const checkConfluencePermissions = async (requestConfluence, accountId, contentId, permission) => {
    const res = await requestConfluence(`/rest/api/content/${contentId}/permission/check`, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            subject: {
                type: 'user',
                identifier: accountId
            },
            operation: permission
        })
    });
    return res;
};
const getPermissionsCheckFactory = (requestConfluence, accountId, contentId) => (permission) => {
    return async () => {
        const res = await checkConfluencePermissions(requestConfluence, accountId, contentId, permission);
        return Boolean(res?.hasPermission);
    };
};
const authorizeConfluenceWithFetch = (requestConfluence, accountId) => {
    return {
        onConfluenceContent: (contentId) => (0, api_1.createApiMethods)(permissions_1.default, getPermissionsCheckFactory(requestConfluence, accountId, contentId))
    };
};
exports.authorizeConfluenceWithFetch = authorizeConfluenceWithFetch;


/***/ }),

/***/ 3534:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createApiMethods = void 0;
const fromEntries = (array) => {
    return array.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
};
const createApiMethods = (methodToPermissionMap, permissionCheckFactory) => {
    const apiMethodEntries = Object.entries(methodToPermissionMap).map(([methodName, permission]) => [methodName, permissionCheckFactory(permission)]);
    return fromEntries(apiMethodEntries);
};
exports.createApiMethods = createApiMethods;


/***/ }),

/***/ 3661:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(3040),
    mapCacheDelete = __webpack_require__(7670),
    mapCacheGet = __webpack_require__(289),
    mapCacheHas = __webpack_require__(4509),
    mapCacheSet = __webpack_require__(2949);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ 3702:
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ 3737:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = __webpack_require__(2017)
var Hash = __webpack_require__(392)
var Buffer = (__webpack_require__(2861).Buffer)

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha1 () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl1 (num) {
  return (num << 1) | (num >>> 31)
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha1.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha1


/***/ }),

/***/ 3743:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authorizeJiraWithFetch = void 0;
const api_1 = __webpack_require__(3534);
const permissions_1 = __webpack_require__(8207);
const arrayEquals = (a, b) => {
    return JSON.stringify(Array.from(a.map(String)).sort()) === JSON.stringify(Array.from(b.map(String)).sort());
};
const checkJiraPermissions = async (requestJira, accountId, projectPermissions) => {
    const res = await requestJira('/rest/api/3/permissions/check', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            accountId,
            projectPermissions
        })
    });
    return res;
};
const hasPermissionsForEntities = (projectPermissions, permission, type, entities) => {
    if (!entities || entities.length === 0)
        return true;
    const allowedEntities = projectPermissions.find((permissionResponse) => permissionResponse.permission === permission)?.[type];
    return !!allowedEntities && arrayEquals(allowedEntities, entities);
};
const getPermissionCheckFactory = (requestJira, accountId, type, entities) => (permission) => {
    return async () => {
        const { projectPermissions } = await checkJiraPermissions(requestJira, accountId, [
            {
                permissions: [permission],
                [type]: entities
            }
        ]);
        return hasPermissionsForEntities(projectPermissions, permission, type, entities);
    };
};
const toArray = (id) => (Array.isArray(id) ? id : [id]);
const authorizeJiraWithFetch = (requestJira, accountId) => {
    return {
        onJira: async (projectPermissionsInput) => {
            const result = await checkJiraPermissions(requestJira, accountId, projectPermissionsInput);
            return result.projectPermissions || [];
        },
        onJiraProject: (projects) => (0, api_1.createApiMethods)(permissions_1.API_PROJECTS_PERMISSIONS_MAP, getPermissionCheckFactory(requestJira, accountId, 'projects', toArray(projects))),
        onJiraIssue: (issues) => (0, api_1.createApiMethods)(permissions_1.API_ISSUES_PERMISSIONS_MAP, getPermissionCheckFactory(requestJira, accountId, 'issues', toArray(issues)))
    };
};
exports.authorizeJiraWithFetch = authorizeJiraWithFetch;


/***/ }),

/***/ 3805:
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 3862:
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ 3976:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalStorage = void 0;
const errors_1 = __webpack_require__(4636);
const gql_queries_1 = __webpack_require__(3122);
function assertNoErrors(errors) {
    if (errors && errors.length > 0) {
        const { message, extensions: { errorType } } = errors[0];
        throw errors_1.APIError.forErrorCode(errorType, message);
    }
}
async function getResponseBody(response) {
    if (response.status !== 200) {
        throw errors_1.APIError.forStatus(response.status);
    }
    const responseText = await response.text();
    let responseBody;
    try {
        responseBody = JSON.parse(responseText);
    }
    catch (error) {
        throw errors_1.APIError.forUnexpected(`Response text was not a valid JSON: ${responseText}`);
    }
    assertNoErrors(responseBody.errors);
    return responseBody.data;
}
class GlobalStorage {
    apiClient;
    getMetrics;
    endpoint = '/forge/entities/graphql';
    constructor(apiClient, getMetrics) {
        this.apiClient = apiClient;
        this.getMetrics = getMetrics;
    }
    async get(key) {
        return this.getInternal(key, false);
    }
    async getSecret(key) {
        return this.getInternal(key, true);
    }
    async list(options) {
        const requestBody = gql_queries_1.UntypedQueries.listQuery(options);
        const response = await this.wrapInMetric('untyped', 'query', false, async () => await this.query(requestBody));
        const edges = response.appStoredEntities.edges;
        const nextCursor = edges.length > 0 ? edges[edges.length - 1].cursor : undefined;
        const results = edges.map(({ node }) => node);
        return {
            results,
            nextCursor
        };
    }
    async listCustomEntities(options) {
        const requestBody = gql_queries_1.CustomEntityQueries.listQuery(options);
        const response = await this.wrapInMetric('typed', 'query', false, async () => await this.query(requestBody));
        const edges = response.appStoredCustomEntities.edges;
        const results = edges.map(({ node }) => node);
        return {
            results,
            nextCursor: response.appStoredCustomEntities.cursor || null
        };
    }
    async set(key, value) {
        const requestBody = gql_queries_1.UntypedQueries.set(key, value, false);
        await this.wrapInMetric('untyped', 'set', false, async () => await this.mutation(requestBody, 'appStorage', 'setAppStoredEntity'));
    }
    async setSecret(key, value) {
        const requestBody = gql_queries_1.UntypedQueries.set(key, value, true);
        await this.wrapInMetric('untyped', 'set', true, async () => await this.mutation(requestBody, 'appStorage', 'setAppStoredEntity'));
    }
    async delete(key) {
        const requestBody = gql_queries_1.UntypedQueries.delete(key, false);
        await this.wrapInMetric('untyped', 'delete', false, async () => this.mutation(requestBody, 'appStorage', 'deleteAppStoredEntity'));
    }
    async deleteSecret(key) {
        const requestBody = gql_queries_1.UntypedQueries.delete(key, true);
        await this.wrapInMetric('untyped', 'delete', true, async () => this.mutation(requestBody, 'appStorage', 'deleteAppStoredEntity'));
    }
    async getEntity(entityName, entityKey) {
        return this.getEntityInternal(entityName, entityKey);
    }
    async setEntity(entityName, entityKey, value) {
        const requestBody = gql_queries_1.CustomEntityQueries.set(entityName, entityKey, value);
        await this.wrapInMetric('typed', 'set', false, async () => this.mutation(requestBody, 'appStorageCustomEntity', 'setAppStoredCustomEntity'));
    }
    async deleteEntity(entityName, entityKey) {
        const requestBody = gql_queries_1.CustomEntityQueries.delete(entityName, entityKey);
        await this.wrapInMetric('typed', 'delete', false, async () => await this.mutation(requestBody, 'appStorageCustomEntity', 'deleteAppStoredCustomEntity'));
    }
    async getInternal(key, encrypted) {
        const requestBody = gql_queries_1.UntypedQueries.get(key, encrypted);
        const { appStoredEntity: { value } } = await this.wrapInMetric('untyped', 'get', encrypted, async () => await this.query(requestBody));
        return value ?? undefined;
    }
    async getEntityInternal(entityName, entityKey) {
        const requestBody = gql_queries_1.CustomEntityQueries.get(entityName, entityKey);
        const { appStoredCustomEntity: { value } } = await this.wrapInMetric('typed', 'get', false, async () => await this.query(requestBody));
        return value ?? undefined;
    }
    buildRequest(requestBody) {
        return {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'content-type': 'application/json'
            }
        };
    }
    async query(body) {
        const response = await this.apiClient(this.endpoint, this.buildRequest(body));
        return await getResponseBody(response);
    }
    async mutation(body, namespace, mutationMethod) {
        const response = await this.apiClient(this.endpoint, this.buildRequest(body));
        const { [namespace]: { [mutationMethod]: { success, errors } } } = await getResponseBody(response);
        assertNoErrors(errors);
        if (!success) {
            throw errors_1.APIError.forStatus(500);
        }
        return response;
    }
    async wrapInMetric(store, operation, encrypted, fn) {
        const metrics = this.getMetrics();
        if (!metrics) {
            return await fn();
        }
        const timer = metrics
            .timing('forge.runtime.storage.operation.latency', { store, operation, encrypted: String(encrypted) })
            .measure();
        try {
            const result = await fn();
            timer.stop({ success: 'true' });
            metrics
                .counter('forge.runtime.storage.operation', {
                store,
                operation,
                encrypted: String(encrypted),
                success: 'true'
            })
                .incr();
            return result;
        }
        catch (error) {
            timer.stop({ success: 'false' });
            metrics
                .counter('forge.runtime.storage.operation', {
                store,
                operation,
                encrypted: String(encrypted),
                success: 'false'
            })
                .incr();
            throw error;
        }
    }
}
exports.GlobalStorage = GlobalStorage;


/***/ }),

/***/ 4107:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = __webpack_require__(2017)
var Hash = __webpack_require__(392)
var Buffer = (__webpack_require__(2861).Buffer)

var K = [
  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
]

var W = new Array(64)

function Sha256 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha256, Hash)

Sha256.prototype.init = function () {
  this._a = 0x6a09e667
  this._b = 0xbb67ae85
  this._c = 0x3c6ef372
  this._d = 0xa54ff53a
  this._e = 0x510e527f
  this._f = 0x9b05688c
  this._g = 0x1f83d9ab
  this._h = 0x5be0cd19

  return this
}

function ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x) {
  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
}

function sigma1 (x) {
  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
}

function gamma0 (x) {
  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
}

function gamma1 (x) {
  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
}

Sha256.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0
  var f = this._f | 0
  var g = this._g | 0
  var h = this._h | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0

  for (var j = 0; j < 64; ++j) {
    var T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0
    var T2 = (sigma0(a) + maj(a, b, c)) | 0

    h = g
    g = f
    f = e
    e = (d + T1) | 0
    d = c
    c = b
    b = a
    a = (T1 + T2) | 0
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
  this._f = (f + this._f) | 0
  this._g = (g + this._g) | 0
  this._h = (h + this._h) | 0
}

Sha256.prototype._hash = function () {
  var H = Buffer.allocUnsafe(32)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)
  H.writeInt32BE(this._h, 28)

  return H
}

module.exports = Sha256


/***/ }),

/***/ 4218:
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ 4280:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getI18nSupportedModuleEntries = exports.extractI18nPropertiesFromModules = exports.extractI18nKeysFromModules = exports.getTranslationValue = void 0;
const tslib_1 = __webpack_require__(1635);
tslib_1.__exportStar(__webpack_require__(6893), exports);
tslib_1.__exportStar(__webpack_require__(6829), exports);
tslib_1.__exportStar(__webpack_require__(1100), exports);
tslib_1.__exportStar(__webpack_require__(7898), exports);
var translationValueGetter_1 = __webpack_require__(1813);
Object.defineProperty(exports, "getTranslationValue", ({ enumerable: true, get: function () { return translationValueGetter_1.getTranslationValue; } }));
var moduleI18nHelper_1 = __webpack_require__(9962);
Object.defineProperty(exports, "extractI18nKeysFromModules", ({ enumerable: true, get: function () { return moduleI18nHelper_1.extractI18nKeysFromModules; } }));
Object.defineProperty(exports, "extractI18nPropertiesFromModules", ({ enumerable: true, get: function () { return moduleI18nHelper_1.extractI18nPropertiesFromModules; } }));
Object.defineProperty(exports, "getI18nSupportedModuleEntries", ({ enumerable: true, get: function () { return moduleI18nHelper_1.getI18nSupportedModuleEntries; } }));
tslib_1.__exportStar(__webpack_require__(5181), exports);


/***/ }),

/***/ 4394:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 4509:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ 4636:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.APIError = exports.getErrorMessage = exports.getErrorMessageFromCode = void 0;
const getErrorMessageFromCode = (code, message) => {
    return message ?? code;
};
exports.getErrorMessageFromCode = getErrorMessageFromCode;
const getErrorMessage = (statusCode) => {
    switch (statusCode) {
        case 400:
        case 413:
            return 'Bad request';
        case 401:
            return 'Authentication error';
        case 403:
        case 404:
            return 'Permissions error or key does not exist';
        case 409:
            return 'Conflicting update occurred';
        case 500:
            return 'Internal server error';
        default:
            return `Unknown error. Received status code '${statusCode}'`;
    }
};
exports.getErrorMessage = getErrorMessage;
class APIError extends Error {
    constructor(message) {
        super(message);
    }
    static forStatus(status) {
        return new APIError((0, exports.getErrorMessage)(status));
    }
    static forErrorCode(code, message) {
        return new APIError((0, exports.getErrorMessageFromCode)(code, message));
    }
    static forUnexpected(message) {
        return new APIError(message);
    }
}
exports.APIError = APIError;


/***/ }),

/***/ 4739:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ 4840:
/***/ ((module) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;


/***/ }),

/***/ 4932:
/***/ ((module) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ 5083:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(1882),
    isMasked = __webpack_require__(7296),
    isObject = __webpack_require__(3805),
    toSource = __webpack_require__(7473);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ 5135:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashDependencies = exports.isSerializable = void 0;
var is_serializable_1 = __webpack_require__(6791);
Object.defineProperty(exports, "isSerializable", ({ enumerable: true, get: function () { return is_serializable_1.isSerializable; } }));
var hash_dependencies_1 = __webpack_require__(1665);
Object.defineProperty(exports, "hashDependencies", ({ enumerable: true, get: function () { return hash_dependencies_1.hashDependencies; } }));


/***/ }),

/***/ 5139:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isBackendEffect = exports.isResultEffect = exports.isRenderEffect = exports.isActionEffect = exports.isEventEffect = void 0;
const isEventEffect = (effect) => {
    return effect.type === 'event';
};
exports.isEventEffect = isEventEffect;
const isActionEffect = (effect) => {
    return effect.type === 'action';
};
exports.isActionEffect = isActionEffect;
const isRenderEffect = (effect) => {
    return effect.type === 'render';
};
exports.isRenderEffect = isRenderEffect;
const isResultEffect = (effect) => {
    return effect.type === 'result';
};
exports.isResultEffect = isResultEffect;
function isBackendEffect(effect) {
    return (0, exports.isActionEffect)(effect) || (0, exports.isEventEffect)(effect) || (0, exports.isRenderEffect)(effect);
}
exports.isBackendEffect = isBackendEffect;


/***/ }),

/***/ 5181:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 5288:
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ 5429:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindInvocationContext = exports.wrapInMetrics = exports.getAppContext = exports.__getRuntime = void 0;
const errors_1 = __webpack_require__(9742);
const ari_1 = __webpack_require__(2167);
function __getRuntime() {
    const runtime = global.__forge_runtime__;
    if (!runtime) {
        throw new Error('Forge runtime not found.');
    }
    return runtime;
}
exports.__getRuntime = __getRuntime;
function getAppContext() {
    const runtime = __getRuntime();
    const { appId, appVersion, environmentId, environmentType, invocationId, installationId, moduleKey, license, installation } = runtime.appContext;
    const invocationRemainingTimeInMillis = runtime.lambdaContext.getRemainingTimeInMillis ??
        (() => {
            throw new Error('Lambda remaining time is not available. If tunnelling, update Forge CLI to the latest version.');
        });
    return {
        appAri: (0, ari_1.getAppAri)(appId),
        appVersion,
        environmentAri: (0, ari_1.getEnvironmentAri)(appId, environmentId),
        environmentType,
        installationAri: (0, ari_1.getInstallationAri)(installationId),
        invocationId,
        invocationRemainingTimeInMillis,
        moduleKey,
        license,
        installation
    };
}
exports.getAppContext = getAppContext;
function wrapInMetrics(name, fn) {
    return async (...args) => {
        const { metrics } = __getRuntime();
        metrics.counter(name).incr();
        const timer = metrics.timing(name).measure();
        let success = true;
        try {
            return await fn(...args);
        }
        catch (e) {
            const undiciError = global.__forge_undici_error__;
            if (e instanceof errors_1.ProxyRequestError ||
                (undiciError && typeof undiciError === 'function' && e instanceof undiciError)) {
                success = false;
            }
            throw e;
        }
        finally {
            timer.stop({ success: success.toString() });
        }
    };
}
exports.wrapInMetrics = wrapInMetrics;
function bindInvocationContext(fn) {
    const AsyncLocalStorage = (__webpack_require__(290).AsyncLocalStorage);
    return AsyncLocalStorage.bind(fn);
}
exports.bindInvocationContext = bindInvocationContext;


/***/ }),

/***/ 5481:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 5749:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ 6014:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.webTrigger = void 0;
const runtime_1 = __webpack_require__(5429);
const fetch_1 = __webpack_require__(8265);
const proxyGetWebTriggerURL = (0, runtime_1.wrapInMetrics)('api.getWebTriggerUrl', async (webTriggerModuleKey, forceCreate) => {
    const runtime = (0, runtime_1.__getRuntime)();
    const response = await (0, fetch_1.__requestAtlassianAsApp)('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            mutation forge_app_createWebTriggerUrl($input: WebTriggerUrlInput!, $forceCreate: Boolean) {
              createWebTriggerUrl(input: $input, forceCreate: $forceCreate) {
                url
              }
            }
          `,
            variables: {
                input: {
                    appId: runtime.appContext.appId,
                    envId: runtime.appContext.environmentId,
                    triggerKey: webTriggerModuleKey,
                    contextId: runtime.contextAri
                },
                forceCreate
            }
        })
    });
    if (!response.ok) {
        throw new Error(`Internal error occurred: Failed to get web trigger URL: ${response.statusText}.`);
    }
    const responseBody = (await response.json());
    if (!responseBody?.data?.createWebTriggerUrl?.url) {
        throw new Error(`Internal error occurred: Failed to get web trigger URL.`);
    }
    return responseBody.data.createWebTriggerUrl.url;
});
const proxyDeleteWebTriggerURL = (0, runtime_1.wrapInMetrics)('api.deleteWebTriggerUrl', async (webTriggerUrl) => {
    const callDelete = async (webTriggerUrlId) => {
        const response = await (0, fetch_1.__requestAtlassianAsApp)('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
            mutation forge_app_deleteWebTriggerUrl($id: ID!) {
              deleteWebTriggerUrl(id: $id) {
                success
                message
              }
            }
          `,
                variables: {
                    id: webTriggerUrlId
                }
            })
        });
        if (!response.ok) {
            throw new Error(`Internal error occurred: Failed to delete web trigger URL: ${response.statusText}.`);
        }
        const responseBody = (await response.json());
        if (!responseBody?.data?.deleteWebTriggerUrl?.success) {
            const errorText = responseBody?.data?.deleteWebTriggerUrl?.message || 'unknown error';
            throw new Error(`Internal error occurred: Failed to delete web trigger URL: ${errorText}`);
        }
    };
    const urlIds = await exports.webTrigger.getUrlIds(webTriggerUrl);
    for (const urlId of urlIds) {
        await callDelete(urlId);
    }
});
const proxyGetWebTriggerUrlIds = (0, runtime_1.wrapInMetrics)('api.getWebTriggerUrlIds', async (webTriggerUrl) => {
    const runtime = (0, runtime_1.__getRuntime)();
    const response = await (0, fetch_1.__requestAtlassianAsApp)('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query forge_app_webTriggerUrlsByAppContext($appId: ID!, $envId: ID!, $contextId: ID!) {
              webTriggerUrlsByAppContext(appId: $appId, envId: $envId, contextId: $contextId) {
                id
                url
              }
            }
          `,
            variables: {
                appId: runtime.appContext.appId,
                envId: runtime.appContext.environmentId,
                contextId: runtime.contextAri
            }
        })
    });
    if (!response.ok) {
        throw new Error(`Internal error occurred: Failed to get web trigger URLs: ${response.statusText}.`);
    }
    const responseBody = (await response.json());
    if (!responseBody?.data?.webTriggerUrlsByAppContext || responseBody.data.webTriggerUrlsByAppContext.length == 0) {
        throw new Error('Internal error occurred: No web trigger URLs found');
    }
    const result = responseBody.data.webTriggerUrlsByAppContext
        .filter((webTriggerResult) => webTriggerResult.url == webTriggerUrl)
        .map((webTriggerResult) => webTriggerResult.id);
    if (!result || result.length == 0) {
        throw new Error('Internal error occurred: Web trigger URL matching URL not found');
    }
    return result;
});
exports.webTrigger = {
    getUrl: async (webTriggerModuleKey, forceCreate = false) => proxyGetWebTriggerURL(webTriggerModuleKey, forceCreate),
    deleteUrl: async (webTriggerUrl) => proxyDeleteWebTriggerURL(webTriggerUrl),
    getUrlIds: async (webTriggerUrl) => proxyGetWebTriggerUrlIds(webTriggerUrl)
};


/***/ }),

/***/ 6019:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomEntityIndexBuilder = exports.APIError = exports.SortOrder = exports.EntityStorageBuilder = exports.FilterConditions = exports.WhereConditions = exports.startsWith = exports.GlobalStorage = exports.getStorageInstanceWithQuery = void 0;
const entity_storage_1 = __webpack_require__(2275);
const query_api_1 = __webpack_require__(258);
const getStorageInstanceWithQuery = (adapter) => {
    return {
        get: adapter.get.bind(adapter),
        set: adapter.set.bind(adapter),
        delete: adapter.delete.bind(adapter),
        getSecret: adapter.getSecret.bind(adapter),
        setSecret: adapter.setSecret.bind(adapter),
        deleteSecret: adapter.deleteSecret.bind(adapter),
        query: () => new query_api_1.DefaultQueryBuilder(adapter),
        entity: (entityName) => new entity_storage_1.EntityStorageBuilder(entityName, adapter)
    };
};
exports.getStorageInstanceWithQuery = getStorageInstanceWithQuery;
var global_storage_1 = __webpack_require__(3976);
Object.defineProperty(exports, "GlobalStorage", ({ enumerable: true, get: function () { return global_storage_1.GlobalStorage; } }));
var conditions_1 = __webpack_require__(6229);
Object.defineProperty(exports, "startsWith", ({ enumerable: true, get: function () { return conditions_1.startsWith; } }));
var conditions_2 = __webpack_require__(8054);
Object.defineProperty(exports, "WhereConditions", ({ enumerable: true, get: function () { return conditions_2.WhereConditions; } }));
Object.defineProperty(exports, "FilterConditions", ({ enumerable: true, get: function () { return conditions_2.FilterConditions; } }));
var entity_storage_2 = __webpack_require__(2275);
Object.defineProperty(exports, "EntityStorageBuilder", ({ enumerable: true, get: function () { return entity_storage_2.EntityStorageBuilder; } }));
var query_interfaces_1 = __webpack_require__(9872);
Object.defineProperty(exports, "SortOrder", ({ enumerable: true, get: function () { return query_interfaces_1.SortOrder; } }));
var errors_1 = __webpack_require__(4636);
Object.defineProperty(exports, "APIError", ({ enumerable: true, get: function () { return errors_1.APIError; } }));
var query_api_2 = __webpack_require__(1026);
Object.defineProperty(exports, "CustomEntityIndexBuilder", ({ enumerable: true, get: function () { return query_api_2.CustomEntityIndexBuilder; } }));


/***/ }),

/***/ 6025:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(5288);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ 6110:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(5083),
    getValue = __webpack_require__(8011);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ 6229:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startsWith = void 0;
function startsWith(value) {
    return {
        condition: 'STARTS_WITH',
        value: value
    };
}
exports.startsWith = startsWith;


/***/ }),

/***/ 6449:
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 6583:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useEffect = void 0;
const tslib_1 = __webpack_require__(1635);
const reconcilerState_1 = tslib_1.__importDefault(__webpack_require__(3441));
const utils_1 = __webpack_require__(5135);
const setHookDependencies = (wipFiber, hash) => {
    if (!wipFiber) {
        throw new Error('cannot resolve useEffect');
    }
    const { currentHookIndex } = wipFiber;
    wipFiber.hooks[currentHookIndex] = { type: 'changeEffect', value: hash };
};
const assertAreDependenciesSerializable = (values) => {
    if (values.some((value) => !(0, utils_1.isSerializable)(value))) {
        throw new Error('Invalid dependencies array. At least one of dependencies is not serializable.');
    }
};
const useEffect = (onChange, dependencies) => {
    var _a;
    assertAreDependenciesSerializable(dependencies);
    const dependenciesHash = (0, utils_1.hashDependencies)(dependencies);
    const { wipFiber } = reconcilerState_1.default;
    const { hooks, currentHookIndex } = wipFiber;
    const componentKey = wipFiber.key;
    const previousState = reconcilerState_1.default.previousState;
    const previousDependenciesHash = ((_a = hooks[currentHookIndex]) === null || _a === void 0 ? void 0 : _a.value) || (previousState[componentKey] && previousState[componentKey][currentHookIndex]);
    if (dependenciesHash !== previousDependenciesHash) {
        reconcilerState_1.default.enableSideEffectsQueue();
        reconcilerState_1.default.enqueueSideEffectIfEnabled({
            type: 'changeEffect',
            onChange
        });
    }
    setHookDependencies(wipFiber, dependenciesHash);
    wipFiber.currentHookIndex++;
};
exports.useEffect = useEffect;


/***/ }),

/***/ 6613:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.i18n = exports.createTranslationFunction = exports.getTranslations = exports.resetTranslationsCache = void 0;
const i18n_1 = __webpack_require__(4280);
const fs_1 = __webpack_require__(9896);
const path_1 = __webpack_require__(6928);
const runtime_1 = __webpack_require__(5429);
const getI18nBundleFolderPath = () => {
    const { appCodeDir } = (0, runtime_1.__getRuntime)().container;
    return appCodeDir ? [appCodeDir, i18n_1.I18N_BUNDLE_FOLDER_NAME] : [i18n_1.I18N_BUNDLE_FOLDER_NAME];
};
const readLocaleFileContent = async (filePath) => {
    const fileContent = await fs_1.promises.readFile((0, path_1.join)(...getI18nBundleFolderPath(), filePath));
    return JSON.parse(fileContent.toString());
};
const makeResourceAccessorErrorMessage = (message) => {
    if (global.__forge_tunnel__) {
        const cliUpdateWarning = 'To access i18n resources while using `forge tunnel`, please ensure that your Forge CLI is up to date. Run `npm install -g @forge/cli` to update to the latest version.';
        return `${message}\n${cliUpdateWarning}`;
    }
    return message;
};
const resolverResourcesAccessor = {
    getI18nInfoConfig: async () => {
        try {
            const info = (await readLocaleFileContent(i18n_1.I18N_INFO_FILE_NAME));
            return info.config;
        }
        catch (error) {
            throw new i18n_1.TranslationGetterError(makeResourceAccessorErrorMessage('Failed to get i18n info config.'));
        }
    },
    getTranslationResource: async (locale) => {
        try {
            return await readLocaleFileContent(`${locale}.json`);
        }
        catch (error) {
            throw new i18n_1.TranslationGetterError(makeResourceAccessorErrorMessage(`Failed to get translation resource for locale: ${locale}.`));
        }
    }
};
const translationsFunctionCache = new Map();
const translationsGetter = new i18n_1.TranslationsGetter(resolverResourcesAccessor);
const resetTranslationsCache = () => {
    translationsGetter.reset();
    translationsFunctionCache.clear();
};
exports.resetTranslationsCache = resetTranslationsCache;
const getTranslations = async (locale, options = {
    fallback: true
}) => {
    return await translationsGetter.getTranslations(locale, options);
};
exports.getTranslations = getTranslations;
const createTranslationFunction = async (locale) => {
    let translator = translationsFunctionCache.get(locale);
    if (!translator) {
        translator = await createTranslationFunctionImpl(locale);
        translationsFunctionCache.set(locale, translator);
    }
    return translator;
};
exports.createTranslationFunction = createTranslationFunction;
const createTranslationFunctionImpl = async (locale) => {
    const translator = new i18n_1.Translator(locale, translationsGetter);
    await translator.init();
    return (i18nKey, defaultValue) => translator.translate(i18nKey) ?? defaultValue ?? i18nKey;
};
exports.i18n = {
    createTranslationFunction: exports.createTranslationFunction,
    getTranslations: exports.getTranslations
};


/***/ }),

/***/ 6637:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useState = void 0;
const useAction_1 = __webpack_require__(8344);
const useState = (initialValue) => {
    return (0, useAction_1.useAction)((_, payload) => payload, initialValue);
};
exports.useState = useState;


/***/ }),

/***/ 6679:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompassContextTypes = exports.isDashboardGadgetExtensionContext = exports.isContentActionExtensionContext = exports.isContextMenuExtensionContext = exports.isCustomFieldExtensionContext = exports.isCustomFieldContextConfigExtensionContext = exports.isIssuePanelExtensionContext = exports.isJiraContext = exports.isForgeElement = void 0;
const isForgeElement = (auxNode) => {
    return auxNode !== null && typeof auxNode !== 'boolean' && auxNode !== undefined;
};
exports.isForgeElement = isForgeElement;
const isJiraContext = (context) => context.type === 'jira';
exports.isJiraContext = isJiraContext;
const isIssuePanelExtensionContext = (extensionContext) => extensionContext.type === 'issuePanel';
exports.isIssuePanelExtensionContext = isIssuePanelExtensionContext;
const isCustomFieldContextConfigExtensionContext = (extensionContext) => extensionContext.type === 'contextConfig';
exports.isCustomFieldContextConfigExtensionContext = isCustomFieldContextConfigExtensionContext;
const isCustomFieldExtensionContext = (extensionContext) => extensionContext.type === 'customField' || extensionContext.type === 'customFieldType';
exports.isCustomFieldExtensionContext = isCustomFieldExtensionContext;
const isContextMenuExtensionContext = (extensionContext) => extensionContext.type === 'contextMenu';
exports.isContextMenuExtensionContext = isContextMenuExtensionContext;
const isContentActionExtensionContext = (extensionContext) => extensionContext.type === 'contentAction';
exports.isContentActionExtensionContext = isContentActionExtensionContext;
const isDashboardGadgetExtensionContext = (extensionContext) => extensionContext.type === 'dashboardGadget';
exports.isDashboardGadgetExtensionContext = isDashboardGadgetExtensionContext;
var CompassContextTypes;
(function (CompassContextTypes) {
    CompassContextTypes["AdminPage"] = "compass:adminPage";
    CompassContextTypes["ComponentPage"] = "compass:componentPage";
    CompassContextTypes["TeamPage"] = "compass:teamPage";
})(CompassContextTypes = exports.CompassContextTypes || (exports.CompassContextTypes = {}));


/***/ }),

/***/ 6698:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 6710:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = __webpack_require__(2017)
var Sha256 = __webpack_require__(4107)
var Hash = __webpack_require__(392)
var Buffer = (__webpack_require__(2861).Buffer)

var W = new Array(64)

function Sha224 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha224, Sha256)

Sha224.prototype.init = function () {
  this._a = 0xc1059ed8
  this._b = 0x367cd507
  this._c = 0x3070dd17
  this._d = 0xf70e5939
  this._e = 0xffc00b31
  this._f = 0x68581511
  this._g = 0x64f98fa7
  this._h = 0xbefa4fa4

  return this
}

Sha224.prototype._hash = function () {
  var H = Buffer.allocUnsafe(28)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)

  return H
}

module.exports = Sha224


/***/ }),

/***/ 6721:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ 6791:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSerializable = void 0;
const PERMITTED_PRIMITIVE_DEPENDENCIES_TYPES = ['string', 'number', 'boolean'];
const isSerializable = (value) => {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'object') {
        return !Object.keys(value).some((key) => !(0, exports.isSerializable)(value[key]));
    }
    if (PERMITTED_PRIMITIVE_DEPENDENCIES_TYPES.includes(typeof value)) {
        return true;
    }
    return false;
};
exports.isSerializable = isSerializable;


/***/ }),

/***/ 6829:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationsGetter = exports.TranslationGetterError = void 0;
const pushIfNotExists = (array, item) => {
    if (!array.includes(item)) {
        array.push(item);
    }
};
class TranslationGetterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TranslationGetterError';
    }
}
exports.TranslationGetterError = TranslationGetterError;
class TranslationsGetter {
    resourcesAccessor;
    i18nInfoConfig = null;
    translationResources = new Map();
    constructor(resourcesAccessor) {
        this.resourcesAccessor = resourcesAccessor;
    }
    async getTranslations(locale, options = { fallback: true }) {
        const i18nInfoConfig = await this.getI18nInfoConfig();
        const { fallback } = options;
        if (!fallback) {
            let translationResource;
            if (i18nInfoConfig.locales.includes(locale)) {
                translationResource = await this.getTranslationResource(locale);
            }
            return {
                translations: translationResource ?? null,
                locale
            };
        }
        for (const targetLocale of this.getLocaleLookupOrder(locale, i18nInfoConfig)) {
            const translationResource = await this.getTranslationResource(targetLocale);
            if (translationResource) {
                return {
                    translations: translationResource,
                    locale: targetLocale
                };
            }
        }
        return {
            translations: null,
            locale
        };
    }
    async getTranslationsByLocaleLookupOrder(locale) {
        const i18nInfoConfig = await this.getI18nInfoConfig();
        const lookupOrder = this.getLocaleLookupOrder(locale, i18nInfoConfig);
        return await Promise.all(lookupOrder.map(async (targetLocale) => {
            const translationResource = await this.getTranslationResource(targetLocale);
            return {
                locale: targetLocale,
                translations: translationResource
            };
        }));
    }
    reset() {
        this.i18nInfoConfig = null;
        this.translationResources.clear();
    }
    async getTranslationResource(locale) {
        let resource = this.translationResources.get(locale);
        if (!resource) {
            try {
                resource = await this.resourcesAccessor.getTranslationResource(locale);
                this.translationResources.set(locale, resource);
            }
            catch (error) {
                if (error instanceof TranslationGetterError) {
                    throw error;
                }
                throw new TranslationGetterError(`Failed to get translation resource for locale: ${locale}`);
            }
        }
        return resource;
    }
    async getI18nInfoConfig() {
        if (!this.i18nInfoConfig) {
            try {
                this.i18nInfoConfig = await this.resourcesAccessor.getI18nInfoConfig();
            }
            catch (error) {
                if (error instanceof TranslationGetterError) {
                    throw error;
                }
                throw new TranslationGetterError('Failed to get i18n info config');
            }
        }
        return this.i18nInfoConfig;
    }
    getLocaleLookupOrder(locale, config) {
        const { locales, fallback } = config;
        const lookupOrder = [locale];
        const fallbackLocales = fallback[locale];
        if (fallbackLocales && Array.isArray(fallbackLocales) && fallbackLocales.length > 0) {
            lookupOrder.push(...fallbackLocales);
        }
        pushIfNotExists(lookupOrder, config.fallback.default);
        return lookupOrder.filter((locale) => locales.includes(locale));
    }
}
exports.TranslationsGetter = TranslationsGetter;


/***/ }),

/***/ 6893:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FORGE_SUPPORTED_LOCALE_CODES = exports.I18N_BUNDLE_FOLDER_NAME = exports.I18N_INFO_FILE_NAME = void 0;
exports.I18N_INFO_FILE_NAME = 'i18n-info.json';
exports.I18N_BUNDLE_FOLDER_NAME = '__LOCALES__';
exports.FORGE_SUPPORTED_LOCALE_CODES = [
    'zh-CN',
    'zh-TW',
    'cs-CZ',
    'da-DK',
    'nl-NL',
    'en-US',
    'en-GB',
    'et-EE',
    'fi-FI',
    'fr-FR',
    'de-DE',
    'hu-HU',
    'is-IS',
    'it-IT',
    'ja-JP',
    'ko-KR',
    'no-NO',
    'pl-PL',
    'pt-BR',
    'pt-PT',
    'ro-RO',
    'ru-RU',
    'sk-SK',
    'tr-TR',
    'es-ES',
    'sv-SE'
];


/***/ }),

/***/ 6928:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 7131:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpaceSettings = exports.SpacePage = exports.HomepageFeed = exports.GlobalSettings = exports.GlobalPage = exports.SpaceCustomContentListView = exports.PageCustomContentListView = exports.CustomContent = exports.ContextMenu = exports.ContentBylineItem = exports.ContentAction = void 0;
exports.ContentAction = 'ContentAction';
exports.ContentBylineItem = 'ContentBylineItem';
exports.ContextMenu = 'ContextMenu';
exports.CustomContent = 'CustomContent';
exports.PageCustomContentListView = 'PageCustomContentListView';
exports.SpaceCustomContentListView = 'SpaceCustomContentListView';
exports.GlobalPage = 'GlobalPage';
exports.GlobalSettings = 'GlobalSettings';
exports.HomepageFeed = 'HomepageFeed';
exports.SpacePage = 'SpacePage';
exports.SpaceSettings = 'SpaceSettings';


/***/ }),

/***/ 7274:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.i18n = exports.isExpectedError = exports.isHostedCodeError = exports.isForgePlatformError = exports.FUNCTION_ERR = exports.HttpError = exports.InvalidWorkspaceRequestedError = exports.NotAllowedError = exports.RequestProductNotAllowedError = exports.ProductEndpointNotAllowedError = exports.ExternalEndpointNotAllowedError = exports.FetchError = exports.ProxyRequestError = exports.NeedsAuthenticationError = exports.bindInvocationContext = exports.__getRuntime = exports.getAppContext = exports.routeFromAbsolute = exports.assumeTrustedRoute = exports.route = exports.SortOrder = exports.FilterConditions = exports.WhereConditions = exports.startsWith = exports.createRequestStargateAsApp = exports.__fetchProduct = exports.__requestAtlassianAsUser = exports.__requestAtlassianAsApp = exports.webTrigger = exports.storage = exports.invokeRemote = exports.requestBitbucket = exports.requestConfluence = exports.requestJira = exports.fetch = exports.authorize = exports.asApp = exports.asUser = exports.privacy = void 0;
const storage_1 = __webpack_require__(6019);
const authorization_1 = __webpack_require__(9140);
Object.defineProperty(exports, "authorize", ({ enumerable: true, get: function () { return authorization_1.authorize; } }));
const privacy_1 = __webpack_require__(1317);
const webTrigger_1 = __webpack_require__(6014);
Object.defineProperty(exports, "webTrigger", ({ enumerable: true, get: function () { return webTrigger_1.webTrigger; } }));
const remote_1 = __webpack_require__(2391);
Object.defineProperty(exports, "invokeRemote", ({ enumerable: true, get: function () { return remote_1.invokeRemote; } }));
const fetch_1 = __webpack_require__(8265);
Object.defineProperty(exports, "__fetchProduct", ({ enumerable: true, get: function () { return fetch_1.__fetchProduct; } }));
Object.defineProperty(exports, "__requestAtlassianAsApp", ({ enumerable: true, get: function () { return fetch_1.__requestAtlassianAsApp; } }));
Object.defineProperty(exports, "__requestAtlassianAsUser", ({ enumerable: true, get: function () { return fetch_1.__requestAtlassianAsUser; } }));
const runtime_1 = __webpack_require__(5429);
const fetchAPI = (0, fetch_1.getFetchAPI)();
const asUser = fetchAPI.asUser;
exports.asUser = asUser;
const asApp = fetchAPI.asApp;
exports.asApp = asApp;
const fetch = fetchAPI.fetch;
exports.fetch = fetch;
const requestJira = fetchAPI.requestJira;
exports.requestJira = requestJira;
const requestConfluence = fetchAPI.requestConfluence;
exports.requestConfluence = requestConfluence;
const requestBitbucket = fetchAPI.requestBitbucket;
exports.requestBitbucket = requestBitbucket;
const storage = (0, storage_1.getStorageInstanceWithQuery)(new storage_1.GlobalStorage(fetch_1.__requestAtlassianAsApp, () => (0, runtime_1.__getRuntime)().metrics));
exports.storage = storage;
const API = {
    ...fetchAPI,
    invokeRemote: remote_1.invokeRemote
};
exports.privacy = {
    reportPersonalData: (0, privacy_1.createReportPersonalData)(fetch_1.__requestAtlassianAsApp)
};
exports["default"] = API;
const createRequestStargateAsApp = () => fetch_1.__requestAtlassianAsApp;
exports.createRequestStargateAsApp = createRequestStargateAsApp;
var storage_2 = __webpack_require__(6019);
Object.defineProperty(exports, "startsWith", ({ enumerable: true, get: function () { return storage_2.startsWith; } }));
Object.defineProperty(exports, "WhereConditions", ({ enumerable: true, get: function () { return storage_2.WhereConditions; } }));
Object.defineProperty(exports, "FilterConditions", ({ enumerable: true, get: function () { return storage_2.FilterConditions; } }));
Object.defineProperty(exports, "SortOrder", ({ enumerable: true, get: function () { return storage_2.SortOrder; } }));
var safeUrl_1 = __webpack_require__(1228);
Object.defineProperty(exports, "route", ({ enumerable: true, get: function () { return safeUrl_1.route; } }));
Object.defineProperty(exports, "assumeTrustedRoute", ({ enumerable: true, get: function () { return safeUrl_1.assumeTrustedRoute; } }));
Object.defineProperty(exports, "routeFromAbsolute", ({ enumerable: true, get: function () { return safeUrl_1.routeFromAbsolute; } }));
var runtime_2 = __webpack_require__(5429);
Object.defineProperty(exports, "getAppContext", ({ enumerable: true, get: function () { return runtime_2.getAppContext; } }));
Object.defineProperty(exports, "__getRuntime", ({ enumerable: true, get: function () { return runtime_2.__getRuntime; } }));
Object.defineProperty(exports, "bindInvocationContext", ({ enumerable: true, get: function () { return runtime_2.bindInvocationContext; } }));
var errors_1 = __webpack_require__(9742);
Object.defineProperty(exports, "NeedsAuthenticationError", ({ enumerable: true, get: function () { return errors_1.NeedsAuthenticationError; } }));
Object.defineProperty(exports, "ProxyRequestError", ({ enumerable: true, get: function () { return errors_1.ProxyRequestError; } }));
Object.defineProperty(exports, "FetchError", ({ enumerable: true, get: function () { return errors_1.FetchError; } }));
Object.defineProperty(exports, "ExternalEndpointNotAllowedError", ({ enumerable: true, get: function () { return errors_1.ExternalEndpointNotAllowedError; } }));
Object.defineProperty(exports, "ProductEndpointNotAllowedError", ({ enumerable: true, get: function () { return errors_1.ProductEndpointNotAllowedError; } }));
Object.defineProperty(exports, "RequestProductNotAllowedError", ({ enumerable: true, get: function () { return errors_1.RequestProductNotAllowedError; } }));
Object.defineProperty(exports, "NotAllowedError", ({ enumerable: true, get: function () { return errors_1.NotAllowedError; } }));
Object.defineProperty(exports, "InvalidWorkspaceRequestedError", ({ enumerable: true, get: function () { return errors_1.InvalidWorkspaceRequestedError; } }));
Object.defineProperty(exports, "HttpError", ({ enumerable: true, get: function () { return errors_1.HttpError; } }));
Object.defineProperty(exports, "FUNCTION_ERR", ({ enumerable: true, get: function () { return errors_1.FUNCTION_ERR; } }));
Object.defineProperty(exports, "isForgePlatformError", ({ enumerable: true, get: function () { return errors_1.isForgePlatformError; } }));
Object.defineProperty(exports, "isHostedCodeError", ({ enumerable: true, get: function () { return errors_1.isHostedCodeError; } }));
Object.defineProperty(exports, "isExpectedError", ({ enumerable: true, get: function () { return errors_1.isExpectedError; } }));
var i18n_1 = __webpack_require__(6613);
Object.defineProperty(exports, "i18n", ({ enumerable: true, get: function () { return i18n_1.i18n; } }));


/***/ }),

/***/ 7296:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(5481);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ 7422:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(1769),
    toKey = __webpack_require__(7797);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),

/***/ 7473:
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ 7556:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873),
    arrayMap = __webpack_require__(4932),
    isArray = __webpack_require__(6449),
    isSymbol = __webpack_require__(4394);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ 7560:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityStorageBuilder = void 0;
const query_api_1 = __webpack_require__(1026);
class EntityStorageBuilder {
    entityName;
    globalStorage;
    constructor(entityName, globalStorage) {
        this.entityName = entityName;
        this.globalStorage = globalStorage;
    }
    query() {
        return new query_api_1.CustomEntityBuilder(this.globalStorage).entity(this.entityName);
    }
    get(entityKey) {
        return this.globalStorage.getEntity(this.entityName, entityKey);
    }
    set(entityKey, value) {
        return this.globalStorage.setEntity(this.entityName, entityKey, value);
    }
    delete(entityKey) {
        return this.globalStorage.deleteEntity(this.entityName, entityKey);
    }
}
exports.EntityStorageBuilder = EntityStorageBuilder;


/***/ }),

/***/ 7588:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssueContext = exports.IssueGlance = exports.IssueAction = exports.MacroConfig = exports.Macro = exports.RadioGroup = exports.Radio = exports.ThreeLOPrompt = exports.Select = exports.UserPicker = exports.Option = exports.PortalTextArea = exports.TextField = exports.Tooltip = exports.Toggle = exports.TextArea = exports.StatusLozenge = exports.SectionMessage = exports.Range = exports.ModalDialog = exports.FormCondition = exports.Form = exports.Table = exports.Row = exports.Head = exports.Cell = exports.Heading = exports.Tabs = exports.Tab = exports.Fragment = exports.ErrorPanel = exports.DatePicker = exports.DateLozenge = exports.CheckboxGroup = exports.Checkbox = exports.InlineDialog = exports.Image = exports.Link = exports.Strike = exports.Em = exports.Strong = exports.Text = exports.TagGroup = exports.Tag = exports.Code = exports.ButtonSet = exports.Button = exports.Badge = exports.UserGroup = exports.User = void 0;
exports.AssetsAppImportTypeConfiguration = exports.DashboardGadgetEdit = exports.DashboardGadget = exports.PortalUserMenuAction = exports.PortalRequestViewAction = exports.PortalProfilePanel = exports.PortalFooter = exports.PortalSubheader = exports.PortalHeader = exports.OrganizationPanel = exports.PortalRequestDetailPanel = exports.PortalRequestDetail = exports.QueuePage = exports.ProjectSettingsPage = exports.ProjectPage = exports.AdminPage = exports.CustomFieldContextConfig = exports.PortalRequestCreatePropertyPanel = exports.CustomFieldEdit = exports.CustomField = exports.IssueActivity = exports.IssuePanel = exports.IssuePanelAction = void 0;
const tslib_1 = __webpack_require__(1635);
const _1 = tslib_1.__importStar(__webpack_require__(2026));
const types_1 = __webpack_require__(2928);
const portaRequestCreatePropertyPanelTypes_1 = __webpack_require__(8821);
const useProductContext_1 = __webpack_require__(1352);
exports.User = 'User';
exports.UserGroup = 'UserGroup';
exports.Badge = 'Badge';
exports.Button = 'Button';
exports.ButtonSet = 'ButtonSet';
exports.Code = 'Code';
exports.Tag = 'Tag';
exports.TagGroup = 'TagGroup';
exports.Text = 'Text';
exports.Strong = 'Strong';
exports.Em = 'Em';
exports.Strike = 'Strike';
exports.Link = 'Link';
exports.Image = 'Image';
exports.InlineDialog = 'InlineDialog';
exports.Checkbox = 'Checkbox';
exports.CheckboxGroup = 'CheckboxGroup';
exports.DateLozenge = 'DateLozenge';
exports.DatePicker = 'DatePicker';
exports.ErrorPanel = 'ErrorPanel';
exports.Fragment = 'Fragment';
exports.Tab = 'Tab';
exports.Tabs = 'Tabs';
exports.Heading = 'Heading';
exports.Cell = 'Cell';
exports.Head = 'Head';
exports.Row = 'Row';
exports.Table = 'Table';
exports.Form = 'Form';
exports.FormCondition = 'FormCondition';
exports.ModalDialog = 'ModalDialog';
exports.Range = 'Range';
exports.SectionMessage = 'SectionMessage';
exports.StatusLozenge = 'StatusLozenge';
exports.TextArea = 'TextArea';
exports.Toggle = 'Toggle';
exports.Tooltip = 'Tooltip';
exports.TextField = 'TextField';
exports.PortalTextArea = 'PortalTextArea';
exports.Option = 'Option';
exports.UserPicker = 'UserPicker';
exports.Select = 'Select';
exports.ThreeLOPrompt = 'ThreeLOPrompt';
exports.Radio = 'Radio';
exports.RadioGroup = 'RadioGroup';
const Macro = (props) => {
    return _1.default.createElement(exports.Fragment, null, props.app);
};
exports.Macro = Macro;
exports.MacroConfig = 'MacroConfig';
exports.IssueAction = 'IssueAction';
exports.IssueGlance = 'IssueGlance';
exports.IssueContext = 'IssueContext';
exports.IssuePanelAction = 'IssuePanelAction';
const IssuePanelPrimitive = 'IssuePanel';
const IssuePanel = ({ actions = [], children = [] }) => (_1.default.createElement(IssuePanelPrimitive, null, [...actions, ...(Array.isArray(children) ? children : [children])]));
exports.IssuePanel = IssuePanel;
exports.IssueActivity = 'IssueActivity';
const CustomFieldPrimitive = 'CustomField';
const CustomField = (props) => {
    return _1.default.createElement(CustomFieldPrimitive, null, props.children);
};
exports.CustomField = CustomField;
const CustomFieldEditPrimitive = 'CustomFieldEdit';
const PortalRequestCreatePropertyPanelPrimitive = 'PortalRequestCreatePropertyPanel';
const CustomFieldEdit = ({ children, onSubmit, width = 'medium', header = 'Custom field edit' }) => {
    const extensionContext = (0, useProductContext_1.useProductContext)().extensionContext;
    const incomingFieldValue = extensionContext && (0, types_1.isCustomFieldExtensionContext)(extensionContext) && extensionContext.fieldValue;
    const isInline = extensionContext && (0, types_1.isCustomFieldExtensionContext)(extensionContext) && extensionContext.isInline;
    const initialValue = incomingFieldValue != null && typeof incomingFieldValue !== 'boolean' ? incomingFieldValue : null;
    const [fieldValue, setFieldValue] = (0, _1.useState)({
        value: initialValue,
        updated: false
    });
    const [isOpen, setIsOpen] = (0, _1.useState)(true);
    const closeModal = () => setIsOpen(false);
    const onSaveFn = async (formValue) => {
        const value = await onSubmit(formValue);
        setFieldValue({
            value,
            updated: true
        });
    };
    return (_1.default.createElement(CustomFieldEditPrimitive, { fieldValue: fieldValue, isModalOpen: isOpen }, isInline ? (_1.default.createElement(exports.Form, { onSubmit: onSaveFn, submitButtonText: "Save" }, children)) : (_1.default.createElement(exports.ModalDialog, { header: header, onClose: closeModal, width: width },
        _1.default.createElement(exports.Form, { onSubmit: onSaveFn, submitButtonText: "Save" }, children)))));
};
exports.CustomFieldEdit = CustomFieldEdit;
const PortalRequestCreatePropertyPanel = ({ children, data }) => {
    const [fieldValue, setFieldValue] = (0, _1.useState)({
        value: { data: null, isValid: false },
        updated: false
    });
    const validateCustomPortalFieldValue = (formdata) => {
        const isValid = (formdata === null || formdata === void 0 ? void 0 : formdata.data) !== undefined;
        return isValid;
    };
    const ErrMessages = (errMsg) => {
        throw Error(errMsg);
    };
    (0, _1.useEffect)(() => {
        if (typeof data === 'object') {
            if (Object.keys(data).length != 0) {
                validateCustomPortalFieldValue(data)
                    ? setFieldValue({ value: data, updated: true })
                    : ErrMessages(portaRequestCreatePropertyPanelTypes_1.MISSING_FIELDS);
            }
        }
        else {
            ErrMessages(portaRequestCreatePropertyPanelTypes_1.INVALID_APP_DATA);
        }
    }, [data]);
    return (_1.default.createElement(PortalRequestCreatePropertyPanelPrimitive, { fieldValue: fieldValue }, children));
};
exports.PortalRequestCreatePropertyPanel = PortalRequestCreatePropertyPanel;
const CustomFieldContextConfigPrimitive = 'CustomFieldContextConfig';
const CustomFieldContextConfig = ({ children, onSubmit }) => {
    const [data, onFormSubmit] = (0, _1.useAction)(async (_, formData) => onSubmit(formData), undefined);
    const noop = () => undefined;
    const actionButtons = [_1.default.createElement(exports.Button, { text: "Cancel", appearance: "link", onClick: noop })];
    return (_1.default.createElement(CustomFieldContextConfigPrimitive, { data: data },
        _1.default.createElement(exports.Form, { submitButtonAppearance: "primary", submitButtonText: "Save", actionButtons: actionButtons, onSubmit: onFormSubmit }, children)));
};
exports.CustomFieldContextConfig = CustomFieldContextConfig;
exports.AdminPage = 'AdminPage';
exports.ProjectPage = 'ProjectPage';
exports.ProjectSettingsPage = 'ProjectSettingsPage';
exports.QueuePage = 'QueuePage';
exports.PortalRequestDetail = 'PortalRequestDetail';
exports.PortalRequestDetailPanel = 'PortalRequestDetailPanel';
exports.OrganizationPanel = 'OrganizationPanel';
exports.PortalHeader = 'PortalHeader';
exports.PortalSubheader = 'PortalSubheader';
exports.PortalFooter = 'PortalFooter';
exports.PortalProfilePanel = 'PortalProfilePanel';
exports.PortalRequestViewAction = 'PortalRequestViewAction';
exports.PortalUserMenuAction = 'PortalUserMenuAction';
exports.DashboardGadget = 'DashboardGadget';
const DashboardGadgetEditPrimitive = 'DashboardGadgetEdit';
const DashboardGadgetEdit = ({ children, onSubmit }) => {
    const { extensionContext } = (0, useProductContext_1.useProductContext)();
    const storedGadgetConfiguration = extensionContext && (0, types_1.isDashboardGadgetExtensionContext)(extensionContext) && extensionContext.gadgetConfiguration;
    const [formData, setFormData] = (0, _1.useState)(storedGadgetConfiguration || {});
    const onSaveFn = async (data) => {
        const dataToSave = await onSubmit(data);
        setFormData(dataToSave);
    };
    const noop = () => undefined;
    const actionButtons = [_1.default.createElement(exports.Button, { text: "Cancel", appearance: "link", onClick: noop })];
    return (_1.default.createElement(DashboardGadgetEditPrimitive, { formData: formData },
        _1.default.createElement(exports.Form, { onSubmit: onSaveFn, submitButtonText: "Save", actionButtons: actionButtons }, children)));
};
exports.DashboardGadgetEdit = DashboardGadgetEdit;
const AssetsAppImportTypeConfigurationPrimitive = 'AssetsAppImportTypeConfiguration';
const AssetsAppImportTypeConfiguration = ({ children, onSubmit, renderAsForm = true }) => {
    const [saved, setSaved] = (0, _1.useState)(false);
    const onSaveFn = async (formValue) => {
        const result = await onSubmit(formValue);
        setSaved(result);
    };
    const noop = () => undefined;
    const actionButtons = [_1.default.createElement(exports.Button, { text: "Cancel", appearance: "subtle", onClick: noop })];
    return (_1.default.createElement(AssetsAppImportTypeConfigurationPrimitive, { saved: saved }, renderAsForm ? (_1.default.createElement(exports.Form, { onSubmit: onSaveFn, submitButtonText: "Save configuration", submitButtonAppearance: "primary", actionButtons: actionButtons }, children)) : (children)));
};
exports.AssetsAppImportTypeConfiguration = AssetsAppImportTypeConfiguration;


/***/ }),

/***/ 7670:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ 7797:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isSymbol = __webpack_require__(4394);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ 7816:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
 * in FIPS PUB 180-1
 * This source code is derived from sha1.js of the same repository.
 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
 * operation was added.
 */

var inherits = __webpack_require__(2017)
var Hash = __webpack_require__(392)
var Buffer = (__webpack_require__(2861).Buffer)

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha, Hash)

Sha.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha


/***/ }),

/***/ 7871:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.render = void 0;
const tslib_1 = __webpack_require__(1635);
const reconcilerState_1 = tslib_1.__importDefault(__webpack_require__(3441));
const reconcile_1 = __webpack_require__(8958);
const context_1 = __webpack_require__(8965);
const eventHandlerRegex = /^on[A-Z].*/;
function isValidEventHandlerProp(prop) {
    return eventHandlerRegex.test(prop);
}
const render = (elem) => async (payload, runtimeContext) => {
    reconcilerState_1.default.config = payload.config;
    reconcilerState_1.default.previousState = payload.state;
    reconcilerState_1.default.productContext = (0, context_1.toProductContext)(payload.context, runtimeContext);
    let latestRenderEffect;
    const effects = [...payload.effects];
    while (effects.length !== 0) {
        const effect = effects.shift();
        switch (effect.type) {
            case 'initialize':
            case 'action':
                reconcilerState_1.default.disableSideEffectsQueue();
                reconcilerState_1.default.clearSideEffectsQueue();
                reconcilerState_1.default.currentEffect = effect;
                const fiber = await (0, reconcile_1.processAuxElement)(elem);
                const renderEffect = {
                    type: 'render',
                    aux: { type: 'View', children: (0, reconcile_1.getAuxFromFiber)(fiber) },
                    state: (0, reconcile_1.getStateFromFiber)(fiber)
                };
                effects.push(...reconcilerState_1.default.queuedSideEffects);
                reconcilerState_1.default.previousState = renderEffect.state;
                latestRenderEffect = renderEffect;
                break;
            case 'event':
                if (!isValidEventHandlerProp(effect.handler.prop)) {
                    throw new Error(`Invalid event handler.prop: ${effect.handler.prop}`);
                }
                reconcilerState_1.default.disableSideEffectsQueue();
                reconcilerState_1.default.clearSideEffectsQueue();
                reconcilerState_1.default.currentEffect = effect;
                await (0, reconcile_1.processAuxElement)(elem);
                effects.push(...reconcilerState_1.default.queuedSideEffects);
                break;
            case 'changeEffect':
                reconcilerState_1.default.disableSideEffectsQueue();
                reconcilerState_1.default.clearSideEffectsQueue();
                reconcilerState_1.default.currentEffect = effect;
                reconcilerState_1.default.enableSideEffectsQueue();
                await effect.onChange();
                effects.push(...reconcilerState_1.default.queuedSideEffects);
                break;
            default:
                throw new Error(`Invalid effect: ${JSON.stringify(effect)}`);
        }
    }
    return latestRenderEffect ? [latestRenderEffect] : [];
};
exports.render = render;


/***/ }),

/***/ 7898:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ensureLocale = void 0;
const constants_1 = __webpack_require__(6893);
const forgeSupportedLocaleCodesSet = new Set(constants_1.FORGE_SUPPORTED_LOCALE_CODES);
const localeFallbacks = {
    'en-UK': 'en-GB',
    'nb-NO': 'no-NO'
};
const languageToLocaleCodeMap = constants_1.FORGE_SUPPORTED_LOCALE_CODES.reduce((agg, code) => {
    const [lng] = code.split('-');
    if (!agg[lng]) {
        agg[lng] = code;
    }
    return agg;
}, {
    nb: 'no-NO',
    pt: 'pt-PT'
});
const ensureLocale = (rawLocale) => {
    const locale = rawLocale.replace('_', '-');
    if (forgeSupportedLocaleCodesSet.has(locale)) {
        return locale;
    }
    return languageToLocaleCodeMap[locale] ?? localeFallbacks[locale] ?? null;
};
exports.ensureLocale = ensureLocale;


/***/ }),

/***/ 8011:
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ 8054:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilterConditions = exports.WhereConditions = exports.isIn = exports.isNotEqualTo = void 0;
function isNotEqualTo(value) {
    return {
        condition: 'NOT_EQUAL_TO',
        value
    };
}
exports.isNotEqualTo = isNotEqualTo;
function isIn(values) {
    return {
        condition: 'IN',
        value: values
    };
}
exports.isIn = isIn;
function beginsWith(value) {
    return {
        condition: 'BEGINS_WITH',
        values: [value]
    };
}
function between(values) {
    return {
        condition: 'BETWEEN',
        values
    };
}
function exists() {
    return {
        condition: 'EXISTS',
        values: [true]
    };
}
function doesNotExist() {
    return {
        condition: 'NOT_EXISTS',
        values: [true]
    };
}
function isGreaterThan(value) {
    return {
        condition: 'GREATER_THAN',
        values: [value]
    };
}
function isGreaterThanEqualTo(value) {
    return {
        condition: 'GREATER_THAN_EQUAL_TO',
        values: [value]
    };
}
function isLessThan(value) {
    return {
        condition: 'LESS_THAN',
        values: [value]
    };
}
function isLessThanEqualTo(value) {
    return {
        condition: 'LESS_THAN_EQUAL_TO',
        values: [value]
    };
}
function contains(value) {
    return {
        condition: 'CONTAINS',
        values: [value]
    };
}
function doesNotContain(value) {
    return {
        condition: 'NOT_CONTAINS',
        values: [value]
    };
}
function equalsTo(value) {
    return {
        condition: 'EQUAL_TO',
        values: [value]
    };
}
function notEqualsTo(value) {
    return {
        condition: 'NOT_EQUAL_TO',
        values: [value]
    };
}
exports.WhereConditions = {
    beginsWith,
    between,
    equalsTo,
    isGreaterThan,
    isGreaterThanEqualTo,
    isLessThan,
    isLessThanEqualTo
};
exports.FilterConditions = {
    beginsWith,
    between,
    contains,
    doesNotContain,
    equalsTo,
    notEqualsTo,
    exists,
    doesNotExist,
    isGreaterThan,
    isGreaterThanEqualTo,
    isLessThan,
    isLessThanEqualTo
};


/***/ }),

/***/ 8156:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(7422);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ 8207:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.API_PROJECTS_PERMISSIONS_MAP = exports.API_ISSUES_PERMISSIONS_MAP = void 0;
const API_ISSUES_PERMISSIONS_MAP = {
    canAssign: 'ASSIGN_ISSUES',
    canCreate: 'CREATE_ISSUES',
    canEdit: 'EDIT_ISSUES',
    canMove: 'MOVE_ISSUES',
    canDelete: 'DELETE_ISSUES',
    canAddComments: 'ADD_COMMENTS',
    canEditAllComments: 'EDIT_ALL_COMMENTS',
    canDeleteAllComments: 'DELETE_ALL_COMMENTS',
    canCreateAttachments: 'CREATE_ATTACHMENTS',
    canDeleteAllAttachments: 'DELETE_ALL_ATTACHMENTS'
};
exports.API_ISSUES_PERMISSIONS_MAP = API_ISSUES_PERMISSIONS_MAP;
const API_PROJECTS_PERMISSIONS_MAP = {
    canAssignIssues: 'ASSIGN_ISSUES',
    canCreateIssues: 'CREATE_ISSUES',
    canEditIssues: 'EDIT_ISSUES',
    canMoveIssues: 'MOVE_ISSUES',
    canDeleteIssues: 'DELETE_ISSUES',
    canAddComments: 'ADD_COMMENTS',
    canEditAllComments: 'EDIT_ALL_COMMENTS',
    canDeleteAllComments: 'DELETE_ALL_COMMENTS',
    canCreateAttachments: 'CREATE_ATTACHMENTS',
    canDeleteAllAttachments: 'DELETE_ALL_ATTACHMENTS'
};
exports.API_PROJECTS_PERMISSIONS_MAP = API_PROJECTS_PERMISSIONS_MAP;


/***/ }),

/***/ 8223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 8265:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.__requestAtlassianAsUser = exports.__requestAtlassianAsApp = exports.getFetchAPI = exports.wrapRequestConnectedData = exports.wrapRequestGraph = exports.handleProxyResponseErrors = exports.getForgeProxyError = exports.fetchRemote = exports.__fetchProduct = void 0;
const safeUrl_1 = __webpack_require__(1228);
const runtime_1 = __webpack_require__(5429);
const errors_1 = __webpack_require__(9742);
async function wrapInMetrics(options, cb) {
    const metrics = (0, runtime_1.__getRuntime)().metrics;
    metrics.counter(options.name, options.tags).incr();
    const timer = metrics.timing(options.name, options.tags).measure();
    try {
        return await cb();
    }
    finally {
        timer.stop();
    }
}
function __fetchProduct(args) {
    return async (path, init) => {
        const response = await global.__forge_fetch__({
            type: args.type,
            provider: args.provider,
            remote: args.remote,
            accountId: args.accountId
        }, path, init);
        (0, exports.handleProxyResponseErrors)(response);
        return response;
    };
}
exports.__fetchProduct = __fetchProduct;
function fetchRemote(args) {
    return async (path, init) => {
        const response = await global.__forge_fetch__({
            type: 'tpp',
            provider: args.provider,
            remote: args.remote,
            accountId: args.account
        }, path, init);
        (0, exports.handleProxyResponseErrors)(response);
        return response;
    };
}
exports.fetchRemote = fetchRemote;
function getDefaultRemote(provider) {
    const externalAuthProvider = findExternalAuthProviderConfigOrThrow(provider);
    if (!externalAuthProvider.remotes.length) {
        throw new Error(`Missing remote config for provider ${provider}`);
    }
    return externalAuthProvider.remotes[0].key;
}
function findExternalAuthProviderConfigOrThrow(provider) {
    const { externalAuth } = (0, runtime_1.__getRuntime)();
    const externalAuthProvider = externalAuth?.find((externalAuthMetaData) => {
        return externalAuthMetaData.service === provider;
    });
    if (!externalAuthProvider) {
        throw new Error(`Bad provider or missing config for provider ${provider}`);
    }
    return externalAuthProvider;
}
const ATLASSIAN_TOKEN_SERVICE_KEY = 'atlassian-token-service-key';
const getForgeProxyError = (response) => response.headers.get('forge-proxy-error');
exports.getForgeProxyError = getForgeProxyError;
const handleProxyResponseErrors = (response) => {
    const errorReason = (0, exports.getForgeProxyError)(response);
    if (errorReason) {
        if (errorReason === 'NEEDS_AUTHENTICATION_ERR') {
            throw new errors_1.NeedsAuthenticationError('Authentication Required', ATLASSIAN_TOKEN_SERVICE_KEY);
        }
        throw new errors_1.ProxyRequestError(response.status, errorReason);
    }
};
exports.handleProxyResponseErrors = handleProxyResponseErrors;
function lazyThrowNeedsAuthenticationError(serviceKey) {
    return async (scopes) => wrapInMetrics({ name: 'api.asUser.withProvider.requestCredentials', tags: { passingScopes: String(!!scopes) } }, async () => {
        throw new errors_1.NeedsAuthenticationError('Authentication Required', serviceKey, { scopes, isExpectedError: true });
    });
}
function buildExternalAuthAccountsInfo(provider, remote) {
    const { accounts } = findExternalAuthProviderConfigOrThrow(provider);
    const buildAccountModel = (account) => {
        const { externalAccountId: id, ...rest } = account;
        return { ...rest, id };
    };
    const buildExternalAuthAccountMethods = (account, outboundAuthAccountId) => ({
        hasCredentials: async (scopes) => wrapInMetrics({ name: 'api.asUser.withProvider.hasCredentials', tags: { passingScopes: String(!!scopes) } }, async () => !scopes || scopes.every((scope) => account.scopes.includes(scope))),
        requestCredentials: lazyThrowNeedsAuthenticationError(provider),
        getAccount: async () => wrapInMetrics({ name: 'api.asUser.withProvider.getAccount' }, async () => account),
        fetch: wrapWithRouteUnwrapper(fetchRemote({ provider, remote: remote ?? getDefaultRemote(provider), account: outboundAuthAccountId }))
    });
    return accounts.map((account) => {
        const authAccount = buildAccountModel(account);
        return {
            account: authAccount,
            methods: buildExternalAuthAccountMethods(authAccount, account.id)
        };
    });
}
const throwNotImplementedError = () => {
    throw new Error('not implemented');
};
const withProvider = (provider, remote) => {
    const accountsInfo = buildExternalAuthAccountsInfo(provider, remote);
    const defaultAccountInfo = accountsInfo.length ? accountsInfo[0] : undefined;
    const lazyThrowNoValidCredentialsError = () => {
        return (url) => {
            throw new Error(`Fetch failed for ${remote ? `remote '${remote}', ` : ''}provider '${provider}', path '${url}' no credentials previously requested`);
        };
    };
    return {
        hasCredentials: async (scopes) => {
            return defaultAccountInfo
                ? await defaultAccountInfo.methods.hasCredentials(scopes)
                : await wrapInMetrics({ name: 'api.asUser.withProvider.hasCredentials', tags: { passingScopes: String(!!scopes) } }, async () => false);
        },
        getAccount: async () => wrapInMetrics({ name: 'api.asUser.withProvider.getAccount' }, async () => {
            return defaultAccountInfo ? defaultAccountInfo.account : undefined;
        }),
        requestCredentials: lazyThrowNeedsAuthenticationError(provider),
        listCredentials: throwNotImplementedError,
        listAccounts: async () => wrapInMetrics({ name: 'api.asUser.withProvider.listAccounts' }, async () => {
            return accountsInfo.map(({ account }) => account);
        }),
        asAccount: (externalAccountId) => {
            const accountInfo = accountsInfo.find(({ account }) => account.id === externalAccountId);
            if (!accountInfo) {
                throw new Error(`No account with ID ${externalAccountId} found for provider ${provider}`);
            }
            return accountInfo.methods;
        },
        fetch: defaultAccountInfo ? defaultAccountInfo.methods.fetch : lazyThrowNoValidCredentialsError()
    };
};
const wrapWithRouteUnwrapper = (fetch) => (path, init) => {
    const stringPath = (0, safeUrl_1.isRoute)(path) ? path.value : path;
    return fetch(stringPath, init);
};
const wrapRequestProduct = (requestProduct) => (path, init) => {
    const safeUrl = (0, safeUrl_1.requireSafeUrl)(path);
    return requestProduct(safeUrl.value, init);
};
const wrapRequestGraph = (requestGraphApi) => (query, variables, headers = {}) => requestGraphApi('/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query,
        ...(variables ? { variables } : {})
    })
});
exports.wrapRequestGraph = wrapRequestGraph;
const wrapRequestConnectedData = (fetch) => (path, init) => {
    const safeUrl = (0, safeUrl_1.requireSafeUrl)(path);
    return fetch(`/connected-data/${safeUrl.value.replace(/^\/+/, '')}`, init);
};
exports.wrapRequestConnectedData = wrapRequestConnectedData;
function getFetchAPI() {
    if (global.fetch === undefined) {
        global.fetch = async () => {
            throw new Error('The fetch function is not available');
        };
    }
    return {
        fetch: wrapWithRouteUnwrapper(fetch),
        requestJira: wrapRequestProduct(__fetchProduct({ provider: 'none', remote: 'jira', type: 'fpp' })),
        requestConfluence: wrapRequestProduct(__fetchProduct({ provider: 'none', remote: 'confluence', type: 'fpp' })),
        requestBitbucket: wrapRequestProduct(__fetchProduct({ provider: 'none', remote: 'bitbucket', type: 'fpp' })),
        asUser: (userId) => ({
            requestJira: wrapRequestProduct(__fetchProduct({ provider: 'user', remote: 'jira', type: 'fpp', accountId: userId })),
            requestConfluence: wrapRequestProduct(__fetchProduct({ provider: 'user', remote: 'confluence', type: 'fpp', accountId: userId })),
            requestBitbucket: wrapRequestProduct(__fetchProduct({ provider: 'user', remote: 'bitbucket', type: 'fpp', accountId: userId })),
            requestGraph: (0, exports.wrapRequestGraph)(__fetchProduct({ provider: 'user', remote: 'stargate', type: 'fpp', accountId: userId })),
            requestConnectedData: (0, exports.wrapRequestConnectedData)(__fetchProduct({ provider: 'user', remote: 'stargate', type: 'fpp' })),
            withProvider
        }),
        asApp: () => ({
            requestJira: wrapRequestProduct(__fetchProduct({ provider: 'app', remote: 'jira', type: 'fpp' })),
            requestConfluence: wrapRequestProduct(__fetchProduct({ provider: 'app', remote: 'confluence', type: 'fpp' })),
            requestBitbucket: wrapRequestProduct(__fetchProduct({ provider: 'app', remote: 'bitbucket', type: 'fpp' })),
            requestGraph: (0, exports.wrapRequestGraph)(__fetchProduct({ provider: 'app', remote: 'stargate', type: 'fpp' })),
            requestConnectedData: (0, exports.wrapRequestConnectedData)(__fetchProduct({ provider: 'app', remote: 'stargate', type: 'fpp' }))
        })
    };
}
exports.getFetchAPI = getFetchAPI;
function getRequestStargate(provider) {
    if (provider !== 'app' && provider !== 'user') {
        throw new Error(`Unsupported provider: ${provider}`);
    }
    return __fetchProduct({ provider, remote: 'stargate', type: 'fpp' });
}
exports.__requestAtlassianAsApp = getRequestStargate('app');
exports.__requestAtlassianAsUser = getRequestStargate('user');


/***/ }),

/***/ 8344:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useAction = void 0;
const tslib_1 = __webpack_require__(1635);
const reconcilerState_1 = tslib_1.__importDefault(__webpack_require__(3441));
const getCurrentHookAndIncrementIndex = (wipFiber, value) => {
    const currentHookIndex = wipFiber.currentHookIndex;
    const componentKey = wipFiber.key;
    wipFiber.currentHookIndex++;
    wipFiber.hooks[currentHookIndex] = { type: 'action', value };
    return [
        value,
        (payload) => {
            reconcilerState_1.default.enqueueSideEffectIfEnabled({
                type: 'action',
                hookIndex: currentHookIndex,
                componentKey,
                payload
            });
        }
    ];
};
const getHookValueResolver = (wipFiber, value) => {
    const currentHookIndex = wipFiber.currentHookIndex;
    wipFiber.currentHookIndex = 0;
    return Promise.resolve(value).then((value) => {
        reconcilerState_1.default.disableSideEffectsQueue();
        if (!wipFiber) {
            throw new Error('cannot resolve useAction');
        }
        wipFiber.hooks[currentHookIndex] = { type: 'action', value };
    });
};
const processInitialValueAndThrow = (wipFiber, initialValue) => {
    reconcilerState_1.default.enableSideEffectsQueue();
    const value = initialValue instanceof Function ? initialValue() : initialValue;
    const hookValueResolver = getHookValueResolver(wipFiber, value);
    wipFiber.currentHookIndex = 0;
    throw hookValueResolver;
};
const useAction = (actionValueUpdater, initialValue) => {
    const { wipFiber, currentEffect } = reconcilerState_1.default;
    const { hooks, currentHookIndex } = wipFiber;
    if (hooks[currentHookIndex]) {
        const { value } = hooks[currentHookIndex];
        return getCurrentHookAndIncrementIndex(wipFiber, value);
    }
    const previousState = reconcilerState_1.default.previousState;
    const componentKey = wipFiber.key;
    if (currentEffect.type === 'initialize' || !previousState[componentKey]) {
        processInitialValueAndThrow(wipFiber, initialValue);
    }
    else {
        const previousValue = previousState[componentKey][currentHookIndex];
        if (currentEffect.type === 'action' &&
            currentEffect.componentKey === componentKey &&
            currentEffect.hookIndex === currentHookIndex) {
            reconcilerState_1.default.enableSideEffectsQueue();
            const value = actionValueUpdater(previousValue, currentEffect.payload);
            throw getHookValueResolver(wipFiber, value);
        }
        return getCurrentHookAndIncrementIndex(wipFiber, previousValue);
    }
    throw new Error('invalid effect');
};
exports.useAction = useAction;


/***/ }),

/***/ 8393:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const API_PERMISSIONS_MAP = {
    canRead: 'read',
    canUpdate: 'update',
    canDelete: 'delete'
};
exports["default"] = API_PERMISSIONS_MAP;


/***/ }),

/***/ 8586:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(6449),
    isSymbol = __webpack_require__(4394);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),

/***/ 8655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ 8821:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MISSING_FIELDS = exports.INVALID_APP_DATA = void 0;
exports.INVALID_APP_DATA = 'Validation error: Invalid data format.';
exports.MISSING_FIELDS = 'Validation error: Missing app field.';


/***/ }),

/***/ 8958:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStateFromFiber = exports.getAuxFromFiber = exports.processAuxElement = exports.isTextElement = void 0;
const tslib_1 = __webpack_require__(1635);
const types_1 = __webpack_require__(2928);
const reconcilerState_1 = tslib_1.__importDefault(__webpack_require__(3441));
const isTextElement = (element) => element.type === 'Text';
exports.isTextElement = isTextElement;
const flatMap = (fn, items) => items.reduce((bs, a) => bs.concat(fn(a)), []);
const asyncMap = async (fn, items) => {
    const results = [];
    for (const x of items) {
        const result = await fn(x);
        results.push(result);
    }
    return results;
};
const _processAuxElement = (getUniqueName, path) => async (element) => {
    if (typeof element === 'string' || typeof element === 'number') {
        return {
            type: 'text',
            text: element.toString(),
            children: []
        };
    }
    else if (typeof element.type === 'string') {
        const key = getUniqueName(`${element.props.__auxId || element.type}`);
        const currentEffect = reconcilerState_1.default.currentEffect;
        if (currentEffect && currentEffect.type === 'event' && key === currentEffect.handler.componentKey) {
            reconcilerState_1.default.enableSideEffectsQueue();
            await element.props[currentEffect.handler.prop](...currentEffect.args);
            reconcilerState_1.default.disableSideEffectsQueue();
        }
        let childrenFiber = await asyncMap(_processAuxElement(getUniqueName, [...path, element.type]), element.props.children.filter(types_1.isForgeElement));
        if (element.type === 'Text') {
            element.props = {
                ...element.props,
                format: 'markup'
            };
        }
        if (element.type === 'Form') {
            const { actionButtons } = element.props;
            if (actionButtons) {
                const prependActionButtonKey = (name) => {
                    return `actionButton.${getUniqueName(name)}`;
                };
                const actionButtonsFiber = await asyncMap(_processAuxElement(prependActionButtonKey, [...path, element.type]), actionButtons);
                delete element.props.actionButtons;
                childrenFiber = childrenFiber.concat(actionButtonsFiber);
            }
        }
        return {
            type: 'primitive',
            element: {
                ...element,
                type: element.type
            },
            key,
            children: childrenFiber
        };
    }
    else if (typeof element.type === 'function') {
        const { __auxId, ...props } = element.props;
        reconcilerState_1.default.wipFiber = {
            type: 'function',
            element: {
                ...element,
                type: element.type
            },
            key: getUniqueName(`${__auxId || element.type.name}`),
            hooks: [],
            currentHookIndex: 0,
            children: []
        };
        let children = undefined;
        while (children === undefined) {
            try {
                children = element.type(props);
            }
            catch (e) {
                if (e instanceof Promise) {
                    await e;
                }
                else {
                    throw e;
                }
            }
        }
        const fiber = {
            ...reconcilerState_1.default.wipFiber,
            currentHookIndex: 0
        };
        reconcilerState_1.default.clearWipFiber();
        return {
            ...fiber,
            children: await asyncMap(_processAuxElement(getUniqueName, [...path, element.type.name]), children ? [children] : [])
        };
    }
    throw new Error(`Unexpected child type: ${Array.isArray(element) ? 'Array' : element.type || typeof element}. Valid children are @forge/ui components, function components, and strings.\nError occurred in ${path.length > 0 ? path[path.length - 1] : 'render'}${path.length > 1 ? ':\n\tin ' : '.'}${path
        .reverse()
        .slice(1)
        .join('\n\tin ')}`);
};
const processAuxElement = async (element) => {
    const visitedElements = {};
    const getUniqueName = (name) => {
        if (typeof visitedElements[name] === 'undefined') {
            visitedElements[name] = 0;
        }
        else {
            visitedElements[name]++;
        }
        return `${name}.${visitedElements[name]}`;
    };
    return _processAuxElement(getUniqueName, [])(element);
};
exports.processAuxElement = processAuxElement;
const getAuxFromFiber = (fiber) => {
    if (fiber.type === 'text') {
        return [
            {
                type: 'String',
                children: [],
                props: { text: fiber.text }
            }
        ];
    }
    else if (fiber.type === 'primitive') {
        const { element, key, children } = fiber;
        if (element.type === 'Fragment') {
            return flatMap(exports.getAuxFromFiber, children);
        }
        const { children: _, ...props } = element.props;
        return [
            {
                children: flatMap(exports.getAuxFromFiber, children),
                key,
                props: Object.entries(props).reduce((newProps, [propKey, value]) => {
                    newProps[propKey] =
                        typeof value === 'function' ? { componentKey: key, prop: propKey } : value;
                    return newProps;
                }, {}),
                type: element.type
            }
        ];
    }
    return flatMap(exports.getAuxFromFiber, fiber.children);
};
exports.getAuxFromFiber = getAuxFromFiber;
const getStateFromFiber = (fiber) => {
    let state = {};
    if (fiber.type === 'function' && fiber.hooks.some((hook) => hook.type === 'action')) {
        state = {
            [fiber.key]: fiber.hooks.reduce((map, hook, hookIndex) => {
                if (hook.type === 'action') {
                    map[hookIndex] = hook.value;
                }
                if (hook.type === 'changeEffect') {
                    map[hookIndex] = hook.value;
                }
                return map;
            }, {})
        };
    }
    fiber.children.forEach((child) => {
        state = { ...state, ...(0, exports.getStateFromFiber)(child) };
    });
    return state;
};
exports.getStateFromFiber = getStateFromFiber;


/***/ }),

/***/ 8965:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toProductContext = void 0;
const DEFAULT_RUNTIME_CONTEXT = {};
const toProductContext = (context, runtimeContext) => {
    const { principal, installContext, workspaceId, license } = runtimeContext || DEFAULT_RUNTIME_CONTEXT;
    const { cloudId, contentId, localId, spaceKey, spaceId, isConfig, platformContext, extensionContext, moduleKey, environmentId, environmentType, accountType } = context;
    return {
        accountId: principal && principal.accountId,
        accountType,
        cloudId,
        contentId,
        localId,
        spaceKey,
        spaceId,
        installContext,
        platformContext,
        isConfig,
        extensionContext,
        license,
        moduleKey,
        environmentId,
        environmentType,
        workspaceId
    };
};
exports.toProductContext = toProductContext;


/***/ }),

/***/ 9023:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9140:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authorize = void 0;
const auth_1 = __webpack_require__(3318);
const __1 = __webpack_require__(7274);
const authorize = () => {
    const accountId = (0, __1.__getRuntime)().aaid;
    if (!accountId) {
        throw new Error(`Couldn’t find the accountId of the invoking user. This API can only be used inside user-invoked modules.`);
    }
    return {
        ...(0, auth_1.authorizeConfluenceWithFetch)(async (path, opts) => {
            const res = await (0, __1.asUser)().requestConfluence((0, __1.assumeTrustedRoute)(path), opts);
            return res.json();
        }, accountId),
        ...(0, auth_1.authorizeJiraWithFetch)(async (path, opts) => {
            const res = await (0, __1.asUser)().requestJira((0, __1.assumeTrustedRoute)(path), opts);
            return res.json();
        }, accountId)
    };
};
exports.authorize = authorize;


/***/ }),

/***/ 9325:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(4840);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 9350:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 9742:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProxyRequestError = exports.InvalidRemoteError = exports.NeedsAuthenticationError = exports.InvalidWorkspaceRequestedError = exports.RequestProductNotAllowedError = exports.ProductEndpointNotAllowedError = exports.ExternalEndpointNotAllowedError = exports.NotAllowedError = exports.FetchError = exports.HttpError = exports.isExpectedError = exports.isHostedCodeError = exports.isForgePlatformError = exports.PROXY_ERR = exports.INVALID_REMOTE_ERR = exports.NEEDS_AUTHENTICATION_ERR = exports.FUNCTION_FETCH_ERR = exports.REQUEST_EGRESS_ALLOWLIST_ERR = exports.FUNCTION_ERR = void 0;
exports.FUNCTION_ERR = 'FUNCTION_ERR';
exports.REQUEST_EGRESS_ALLOWLIST_ERR = 'REQUEST_EGRESS_ALLOWLIST_ERR';
exports.FUNCTION_FETCH_ERR = 'FUNCTION_FETCH_ERR';
exports.NEEDS_AUTHENTICATION_ERR = 'NEEDS_AUTHENTICATION_ERR';
exports.INVALID_REMOTE_ERR = 'INVALID_REMOTE_ERR';
exports.PROXY_ERR = 'PROXY_ERR';
function isForgePlatformError(err) {
    return [exports.REQUEST_EGRESS_ALLOWLIST_ERR, exports.FUNCTION_FETCH_ERR, exports.NEEDS_AUTHENTICATION_ERR, exports.PROXY_ERR].includes(err.name);
}
exports.isForgePlatformError = isForgePlatformError;
function isHostedCodeError(err) {
    return [exports.FUNCTION_ERR, exports.REQUEST_EGRESS_ALLOWLIST_ERR, exports.FUNCTION_FETCH_ERR, exports.NEEDS_AUTHENTICATION_ERR].includes(typeof err === 'string' ? err : err.name);
}
exports.isHostedCodeError = isHostedCodeError;
function isExpectedError(err) {
    return err.name === exports.NEEDS_AUTHENTICATION_ERR && !!err.options?.isExpectedError;
}
exports.isExpectedError = isExpectedError;
class HttpError extends Error {
    status;
    constructor(message) {
        super(message);
    }
}
exports.HttpError = HttpError;
class FetchError extends Error {
    constructor(cause) {
        super(cause);
        this.stack = undefined;
        this.name = exports.FUNCTION_FETCH_ERR;
    }
}
exports.FetchError = FetchError;
class NotAllowedError extends HttpError {
    constructor(message) {
        super(message);
        this.stack = undefined;
        this.name = exports.REQUEST_EGRESS_ALLOWLIST_ERR;
        this.status = 403;
    }
}
exports.NotAllowedError = NotAllowedError;
class ExternalEndpointNotAllowedError extends NotAllowedError {
    constructor(failedURL) {
        super(`URL not included in the external fetch backend permissions: ${failedURL}. Visit go.atlassian.com/forge-egress for more information.`);
    }
}
exports.ExternalEndpointNotAllowedError = ExternalEndpointNotAllowedError;
class ProductEndpointNotAllowedError extends NotAllowedError {
    constructor(failedURL) {
        super(`URL not allowed: ${failedURL}.`);
    }
}
exports.ProductEndpointNotAllowedError = ProductEndpointNotAllowedError;
class RequestProductNotAllowedError extends NotAllowedError {
    constructor(requestedProduct, invocationProduct) {
        super(`Request ${requestedProduct} is not allowed from ${invocationProduct} context.`);
    }
}
exports.RequestProductNotAllowedError = RequestProductNotAllowedError;
class InvalidWorkspaceRequestedError extends NotAllowedError {
    constructor(failedURL) {
        super(`Invalid workspace requested in URL: ${failedURL}.`);
    }
}
exports.InvalidWorkspaceRequestedError = InvalidWorkspaceRequestedError;
class NeedsAuthenticationError extends HttpError {
    serviceKey;
    options;
    constructor(error, serviceKey, options) {
        super(error);
        this.serviceKey = serviceKey;
        this.options = options;
        this.stack = undefined;
        this.name = exports.NEEDS_AUTHENTICATION_ERR;
        this.status = 401;
    }
}
exports.NeedsAuthenticationError = NeedsAuthenticationError;
class InvalidRemoteError extends HttpError {
    remoteKey;
    constructor(error, remoteKey) {
        super(error);
        this.remoteKey = remoteKey;
        this.name = exports.INVALID_REMOTE_ERR;
        this.status = 400;
    }
}
exports.InvalidRemoteError = InvalidRemoteError;
class ProxyRequestError extends HttpError {
    status;
    errorCode;
    constructor(status, errorCode) {
        super(`Forge platform failed to process runtime HTTP request - ${status} - ${errorCode}`);
        this.status = status;
        this.errorCode = errorCode;
        this.name = exports.PROXY_ERR;
    }
}
exports.ProxyRequestError = ProxyRequestError;


/***/ }),

/***/ 9872:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SortOrder = void 0;
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder = exports.SortOrder || (exports.SortOrder = {}));


/***/ }),

/***/ 9896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 9962:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractI18nPropertiesFromModules = exports.extractI18nKeysFromModules = exports.getI18nSupportedModuleEntries = void 0;
const isObject = (value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};
const isI18nValue = (value) => {
    return typeof value?.i18n === 'string';
};
const isConnectModuleKey = (moduleKey) => moduleKey.startsWith('connect-');
const isCoreModuleKey = (moduleKey) => moduleKey.startsWith('core:');
const getI18nKeysFromObject = (obj) => {
    const visited = new Set();
    const visit = (value, i18nPath) => {
        if (!isObject(value) || visited.has(value)) {
            return [];
        }
        visited.add(value);
        return Object.entries(value).flatMap(([propKey, propValue]) => {
            const currentPath = [...i18nPath, propKey];
            if (isI18nValue(propValue)) {
                return [{ propertyPath: currentPath, key: propValue.i18n }];
            }
            else if (Array.isArray(propValue)) {
                return propValue.flatMap((item) => visit(item, currentPath));
            }
            return visit(propValue, currentPath);
        });
    };
    return visit(obj, []);
};
const getI18nSupportedModuleEntries = (modules) => {
    return Object.entries(modules).flatMap(([moduleKey, moduleEntries]) => {
        if (!isConnectModuleKey(moduleKey) &&
            !isCoreModuleKey(moduleKey) &&
            moduleEntries &&
            Array.isArray(moduleEntries) &&
            moduleEntries.length > 0) {
            return moduleEntries.map((moduleEntry) => [moduleEntry, moduleKey]);
        }
        return [];
    });
};
exports.getI18nSupportedModuleEntries = getI18nSupportedModuleEntries;
const extractI18nKeysFromModules = (modules) => {
    const i18nKeys = new Set();
    for (const moduleEntry of (0, exports.getI18nSupportedModuleEntries)(modules)) {
        const i18nKeysForEntryValue = getI18nKeysFromObject(moduleEntry[0]);
        for (const { key } of i18nKeysForEntryValue) {
            i18nKeys.add(key);
        }
    }
    return i18nKeys.size > 0 ? Array.from(i18nKeys) : [];
};
exports.extractI18nKeysFromModules = extractI18nKeysFromModules;
const extractI18nPropertiesFromModules = (modules) => {
    const moduleI18nProperties = [];
    for (const moduleEntry of (0, exports.getI18nSupportedModuleEntries)(modules)) {
        const i18nKeysForEntryValue = getI18nKeysFromObject(moduleEntry[0]);
        for (const i18nObj of i18nKeysForEntryValue) {
            moduleI18nProperties.push({ moduleName: moduleEntry[1], ...i18nObj });
        }
    }
    return moduleI18nProperties;
};
exports.extractI18nPropertiesFromModules = extractI18nPropertiesFromModules;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fetchSnippetData: () => (/* binding */ fetchSnippetData),
  handler: () => (/* binding */ src_handler)
});

// EXTERNAL MODULE: ./node_modules/@forge/ui/out/index.js
var out = __webpack_require__(2026);
// EXTERNAL MODULE: ./node_modules/@forge/resolver/out/index.js
var resolver_out = __webpack_require__(2382);
// EXTERNAL MODULE: ./node_modules/@forge/api/out/index.js
var api_out = __webpack_require__(7274);
;// ./src/bitbucket-snippet-resolver.js


const resolver = new resolver_out/* default */.A();

// Helper function to extract snippet info from Bitbucket URL
function parseSnippetUrl(snippetUrl) {
  try {
    const url = new URL(snippetUrl);
    if (url.hostname !== 'bitbucket.org' || !url.pathname.includes('/snippets/')) {
      throw new Error('Invalid Bitbucket snippet URL');
    }
    const pathParts = url.pathname.split('/').filter(part => part);
    // Expected format: /snippets/{username}/{snippet_id} or /snippets/{username}/{snippet_id}/{revision}
    if (pathParts.length < 3 || pathParts[0] !== 'snippets') {
      throw new Error('Invalid snippet URL format');
    }
    return {
      username: pathParts[1],
      snippetId: pathParts[2],
      revision: pathParts[3] || null
    };
  } catch (error) {
    console.error('Error parsing snippet URL:', error);
    throw error;
  }
}

// Fetch snippet data from Bitbucket API
resolver.define('fetchSnippetData', async req => {
  var _req$payload, _req$context;
  // Get snippet URL from config (for manual entry) or autoConvertLink (for autoconvert)
  const snippetUrl = ((_req$payload = req.payload) === null || _req$payload === void 0 ? void 0 : _req$payload.snippetUrl) || ((_req$context = req.context) === null || _req$context === void 0 || (_req$context = _req$context.extension) === null || _req$context === void 0 || (_req$context = _req$context.config) === null || _req$context === void 0 ? void 0 : _req$context.autoConvertLink);
  if (!snippetUrl) {
    throw new Error('Snippet URL is required');
  }
  try {
    var _snippetData$links;
    const {
      username,
      snippetId
    } = parseSnippetUrl(snippetUrl);

    // Bitbucket API v2.0 endpoint for snippets
    const apiUrl = `https://api.bitbucket.org/2.0/snippets/${username}/${snippetId}`;
    const response = await api_out["default"].fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch snippet: ${response.status} ${response.statusText}`);
    }
    const snippetData = await response.json();

    // Fetch file contents for each file in the snippet
    const filesWithContent = await Promise.all(Object.keys(snippetData.files || {}).map(async filename => {
      const file = snippetData.files[filename];
      try {
        const fileResponse = await api_out["default"].fetch(file.links.self.href, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain'
          }
        });
        if (fileResponse.ok) {
          const content = await fileResponse.text();
          return {
            filename,
            content,
            htmlUrl: file.links.html.href,
            size: file.size
          };
        } else {
          console.warn(`Failed to fetch content for file ${filename}`);
          return {
            filename,
            content: '// Failed to load file content',
            htmlUrl: file.links.html.href,
            size: file.size
          };
        }
      } catch (error) {
        console.error(`Error fetching file ${filename}:`, error);
        return {
          filename,
          content: '// Error loading file content',
          htmlUrl: file.links.html.href,
          size: file.size || 0
        };
      }
    }));
    return {
      title: snippetData.title || 'Untitled Snippet',
      description: snippetData.description || '',
      language: snippetData.language || 'text',
      isPrivate: snippetData.is_private || false,
      createdOn: snippetData.created_on,
      updatedOn: snippetData.updated_on,
      owner: snippetData.owner ? {
        displayName: snippetData.owner.display_name,
        username: snippetData.owner.username
      } : null,
      files: filesWithContent,
      htmlUrl: ((_snippetData$links = snippetData.links) === null || _snippetData$links === void 0 || (_snippetData$links = _snippetData$links.html) === null || _snippetData$links === void 0 ? void 0 : _snippetData$links.href) || snippetUrl
    };
  } catch (error) {
    console.error('Error fetching snippet data:', error);
    throw new Error(`Failed to fetch snippet: ${error.message}`);
  }
});
const handler = resolver.getDefinitions();
;// ./src/index.js




// Main resolver for the existing code editor functionality
const mainResolver = new resolver_out/* default */.A();
mainResolver.define('getText', req => {
  console.log(req);
  return 'Hello, world!';
});

// Export separate handlers for different functions
const src_handler = mainResolver.getDefinitions();
const fetchSnippetData = handler.fetchSnippetData;
})();

var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.cjs.map