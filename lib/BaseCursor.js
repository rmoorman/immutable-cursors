'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _immutable = require('immutable');

var Iterator = _immutable.Iterable.Iterator;

/**
 * @id BaseCursor
 * @lookup BaseCursor
 *
 * ## *mixin* BaseCursor
 *
 * The BaseCursor mixin contains methods that represent shared behavior of
 * both >KeyedCursor and >IndexedCursor. The reason why these live in a mixin is,
 * that prototypical inheritance on the cursor classes is already occupied by the
 * ImmutableJS base classes KeyedSeq and IndexedSeq respectively.
 *
 * Most of the methods in this mixin override these original Immutable.Seq interface, where
 * cursor implementation has to decorate / circumvent default ImmutableJS behavior.
 *
 *
 * If your are interested in how these overrides work, check out the source. This
 * document only lists the methods that are not part of the original ImmutableJS.Seq
 * interface.
 */
exports['default'] = {

	size: undefined,
	_rootData: undefined,
	_keyPath: undefined,
	_onChange: undefined,
	_api: undefined,
	_sharedOptions: undefined,

	/**
  * #### deref()
  *
  * Returns the >ImmutableJS object that is backing the cursor.
  *
  * ###### Signature:
  * ```js
  * deref(
  *    notSetValue?: any
  * ): Immutable.Iterable
  * ```
  *
  * ###### Arguments:
  * * `notSetValue` - You'll get `notSetValue` returned if there is no backing value for this cursor.
  *
  * ###### Returns:
  * The ImmutableJS backing state of this cursor.
  */
	deref: function deref(notSetValue) {
		return this._rootData.getIn(this._keyPath, notSetValue);
	},

	/**
  * #### valueOf()
  *
  * Alias of deref().
  */
	valueOf: function valueOf() {
		var notSetValue = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

		return this.deref(notSetValue);
	},

	get: function get(key) {
		var notSetValue = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

		return this.getIn(this._api.path(key), notSetValue);
	},

	getIn: function getIn(keyPath) {
		var notSetValue = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

		keyPath = this._api.path(keyPath);
		if (keyPath.size === 0) {
			return this;
		}
		var value = this._rootData.getIn(this._api.path(this._keyPath, keyPath), this._api.NOT_SET);
		return value === this._api.NOT_SET ? notSetValue : this._api.wrappedValue(this, keyPath, value);
	},

	/**
  * #### set()
  *
  * If called with a `key` and a `value`, the substate at `key` will be set to `value`. If you only provide one argument, the backing state of the cursor itself is set directly to the given argument. This makes this method a little different from the one found on >Immutable.Iterable.
  *
  * ###### Signature:
  * ```js
  * set(
  *    key: Array|Immutable.Seq|any,
  *    value?: any
  * ): KeyedCursor|IndexedCursor
  * ```
  *
  * ###### Arguments:
  * * `key` - Either a key path to the substate you want to modify or a value you want to set directly.
  * * `value` - A value.
  *
  * ###### Returns:
  * The cursor representing the new state.
  */
	set: function set(key, value) {
		if (arguments.length === 1) {
			return this._api.updateCursor(this, function () {
				return key;
			}, this._api.path());
		} else {
			return this._api.updateCursor(this, function (m) {
				return m.set(key, value);
			}, this._api.path(key));
		}
	},

	setIn: function setIn(keyPath, value) {
		keyPath = this._api.path(keyPath);
		return _immutable.Map.prototype.setIn.call(this, keyPath, value);
	},

	'delete': function _delete(key) {
		return this._api.updateCursor(this, function (m) {
			return m.remove(key);
		}, this._api.path(key));
	},

	remove: function remove(key) {
		return this['delete'](key);
	},

	deleteIn: function deleteIn(keyPath) {
		return _immutable.Map.prototype.deleteIn.call(this, this._api.path(keyPath));
	},

	removeIn: function removeIn(keyPath) {
		return this.deleteIn(this._api.path(keyPath));
	},

	clear: function clear() {
		return this._api.updateCursor(this, function (m) {
			return m.clear();
		});
	},

	update: function update(keyOrFn) {
		var notSetValue = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
		var updater = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

		return !updater ? this._api.updateCursor(this, keyOrFn) : this.updateIn(this._api.path(keyOrFn), notSetValue, updater);
	},

	updateIn: function updateIn(keyPath, notSetValue, updater) {
		keyPath = this._api.path(keyPath);
		return this._api.updateCursor(this, function (m) {
			return m.updateIn(keyPath, notSetValue, updater);
		}, keyPath);
	},

	merge: function merge() {
		for (var _len = arguments.length, iterables = Array(_len), _key = 0; _key < _len; _key++) {
			iterables[_key] = arguments[_key];
		}

		return this._api.updateCursor(this, function (m) {
			return m.merge.apply(m, iterables);
		});
	},

	mergeWith: function mergeWith(merger) {
		for (var _len2 = arguments.length, iterables = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			iterables[_key2 - 1] = arguments[_key2];
		}

		return this._api.updateCursor(this, function (m) {
			var _m$mergeWith;

			return (_m$mergeWith = m.mergeWith).call.apply(_m$mergeWith, [m, merger].concat(iterables));
		});
	},

	mergeIn: function mergeIn(keyPath) {
		var _Map$prototype$mergeIn;

		for (var _len3 = arguments.length, iterables = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
			iterables[_key3 - 1] = arguments[_key3];
		}

		return (_Map$prototype$mergeIn = _immutable.Map.prototype.mergeIn).call.apply(_Map$prototype$mergeIn, [this, this._api.path(keyPath)].concat(iterables));
	},

	mergeDeep: function mergeDeep() {
		for (var _len4 = arguments.length, iterables = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			iterables[_key4] = arguments[_key4];
		}

		return this._api.updateCursor(this, function (m) {
			return m.mergeDeep.apply(m, iterables);
		});
	},

	mergeDeepWith: function mergeDeepWith(merger) {
		for (var _len5 = arguments.length, iterables = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
			iterables[_key5 - 1] = arguments[_key5];
		}

		return this._api.updateCursor(this, function (m) {
			var _m$mergeDeepWith;

			return (_m$mergeDeepWith = m.mergeDeepWith).call.apply(_m$mergeDeepWith, [m, merger].concat(iterables));
		});
	},

	mergeDeepIn: function mergeDeepIn(keyPath) {
		var _Map$prototype;

		for (var _len6 = arguments.length, iterables = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
			iterables[_key6 - 1] = arguments[_key6];
		}

		return (_Map$prototype = _immutable.Map.prototype).call.apply(_Map$prototype, [this, this._api.path(keyPath)].concat(iterables));
	},

	withMutations: function withMutations(fn) {
		return this._api.updateCursor(this, function (m) {
			return (m || new _immutable.Map()).withMutations(fn);
		});
	},

	cursor: function cursor(subKeyPath) {
		subKeyPath = this._api.path(subKeyPath);
		return subKeyPath.size === 0 ? this : this._api.subCursor(this, subKeyPath);
	},

	__iterate: function __iterate(fn, reverse) {
		var _this = this;

		var cursor = this;
		var deref = cursor.deref();
		return deref && deref.__iterate ? deref.__iterate(function (v, k) {
			return fn(_this._api.wrappedValue(cursor, [k], v), k, cursor);
		}, reverse) : 0;
	},

	__iterator: function __iterator(type, reverse) {
		var _this2 = this;

		var deref = this.deref();
		var cursor = this;
		var iterator = deref && deref.__iterator && deref.__iterator(Iterator.ENTRIES, reverse);
		return new Iterator(function () {
			if (!iterator) {
				return { value: undefined, done: true };
			}
			var step = iterator.next();
			if (step.done) {
				return step;
			}
			var entry = step.value;
			var k = entry[0];
			var v = _this2._api.wrappedValue(cursor, [k], entry[1]);
			return {
				value: type === Iterator.KEYS ? k : type === Iterator.VALUES ? v : [k, v],
				done: false
			};
		});
	}
};
module.exports = exports['default'];