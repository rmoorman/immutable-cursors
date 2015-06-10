'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _immutable = require('immutable');

var Iterator = _immutable.Iterable.Iterator;

var KeyedCursor = (function (_Seq$Keyed) {
	function KeyedCursor(rootData, keyPath, onChange, size, api) {
		_classCallCheck(this, KeyedCursor);

		_get(Object.getPrototypeOf(KeyedCursor.prototype), 'constructor', this).call(this);
		this.size = size;
		this._rootData = rootData;
		this._keyPath = keyPath;
		this._onChange = onChange;
		this._api = api;
	}

	_inherits(KeyedCursor, _Seq$Keyed);

	_createClass(KeyedCursor, [{
		key: 'toString',
		value: function toString() {
			return this.__toString('KeyedCursor {', '}');
		}
	}, {
		key: 'deref',
		value: function deref() {
			var notSetValue = arguments[0] === undefined ? undefined : arguments[0];

			return this._rootData.getIn(this._keyPath, notSetValue);
		}
	}, {
		key: 'valueOf',
		value: function valueOf() {
			var notSetValue = arguments[0] === undefined ? undefined : arguments[0];

			return this.deref(notSetValue);
		}
	}, {
		key: 'get',
		value: function get(key) {
			var notSetValue = arguments[1] === undefined ? undefined : arguments[1];

			return this.getIn([key], notSetValue);
		}
	}, {
		key: 'getIn',
		value: function getIn(keyPath) {
			var notSetValue = arguments[1] === undefined ? undefined : arguments[1];

			keyPath = this._api.listToKeyPath(keyPath);
			if (keyPath.length === 0) {
				return this;
			}
			var value = this._rootData.getIn(this._api.newKeyPath(this._keyPath, keyPath), this._api.NOT_SET);
			return value === this._api.NOT_SET ? notSetValue : this._api.wrappedValue(this, keyPath, value);
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			return this._api.updateCursor(this, function (m) {
				return m.set(key, value);
			}, [key]);
		}
	}, {
		key: 'setIn',
		value: function setIn(keyPath, value) {
			return _immutable.Map.prototype.setIn.call(this, keyPath, value);
		}
	}, {
		key: 'delete',
		value: function _delete(key) {
			return this._api.updateCursor(this, function (m) {
				return m.remove(key);
			}, [key]);
		}
	}, {
		key: 'remove',
		value: function remove(key) {
			return this['delete'](key);
		}
	}, {
		key: 'deleteIn',
		value: function deleteIn(keyPath) {
			return _immutable.Map.prototype.deleteIn.call(this, keyPath);
		}
	}, {
		key: 'removeIn',
		value: function removeIn(keyPath) {
			return this.deleteIn(keyPath);
		}
	}, {
		key: 'clear',
		value: function clear() {
			return this._api.updateCursor(this, function (m) {
				return m.clear();
			});
		}
	}, {
		key: 'update',
		value: function update(keyOrFn) {
			var notSetValue = arguments[1] === undefined ? undefined : arguments[1];
			var updater = arguments[2] === undefined ? undefined : arguments[2];

			return !updater ? this._api.updateCursor(this, keyOrFn) : this.updateIn([keyOrFn], notSetValue, updater);
		}
	}, {
		key: 'updateIn',
		value: function updateIn(keyPath, notSetValue, updater) {
			return this._api.updateCursor(this, function (m) {
				return m.updateIn(keyPath, notSetValue, updater);
			}, keyPath);
		}
	}, {
		key: 'merge',
		value: function merge() {
			for (var _len = arguments.length, iterables = Array(_len), _key = 0; _key < _len; _key++) {
				iterables[_key] = arguments[_key];
			}

			return this._api.updateCursor(this, function (m) {
				return m.merge.apply(m, iterables);
			});
		}
	}, {
		key: 'mergeWith',
		value: function mergeWith(merger) {
			for (var _len2 = arguments.length, iterables = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				iterables[_key2 - 1] = arguments[_key2];
			}

			return this._api.updateCursor(this, function (m) {
				var _m$mergeWith;

				return (_m$mergeWith = m.mergeWith).call.apply(_m$mergeWith, [m, merger].concat(iterables));
			});
		}
	}, {
		key: 'mergeIn',
		value: function mergeIn(keyPath) {
			var _Map$prototype$mergeIn;

			for (var _len3 = arguments.length, iterables = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				iterables[_key3 - 1] = arguments[_key3];
			}

			return (_Map$prototype$mergeIn = _immutable.Map.prototype.mergeIn).call.apply(_Map$prototype$mergeIn, [this, keyPath].concat(iterables));
		}
	}, {
		key: 'mergeDeep',
		value: function mergeDeep() {
			for (var _len4 = arguments.length, iterables = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				iterables[_key4] = arguments[_key4];
			}

			return this._api.updateCursor(this, function (m) {
				return m.mergeDeep.apply(m, iterables);
			});
		}
	}, {
		key: 'mergeDeepWith',
		value: function mergeDeepWith(merger) {
			for (var _len5 = arguments.length, iterables = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
				iterables[_key5 - 1] = arguments[_key5];
			}

			return this._api.updateCursor(this, function (m) {
				var _m$mergeDeepWith;

				return (_m$mergeDeepWith = m.mergeDeepWith).call.apply(_m$mergeDeepWith, [m, merger].concat(iterables));
			});
		}
	}, {
		key: 'mergeDeepIn',
		value: function mergeDeepIn(keyPath) {
			var _Map$prototype;

			for (var _len6 = arguments.length, iterables = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
				iterables[_key6 - 1] = arguments[_key6];
			}

			return (_Map$prototype = _immutable.Map.prototype).call.apply(_Map$prototype, [this, keyPath].concat(iterables));
		}
	}, {
		key: 'withMutations',
		value: function withMutations(fn) {
			return this._api.updateCursor(this, function (m) {
				return (m || new _immutable.Map()).withMutations(fn);
			});
		}
	}, {
		key: 'cursor',
		value: function cursor(subKeyPath) {
			subKeyPath = this._api.valToKeyPath(subKeyPath);
			return subKeyPath.length === 0 ? this : this._api.subCursor(this, subKeyPath);
		}
	}, {
		key: '__iterate',
		value: function __iterate(fn, reverse) {
			var _this = this;

			var cursor = this;
			var deref = cursor.deref();
			return deref && deref.__iterate ? deref.__iterate(function (v, k) {
				return fn(_this._api.wrappedValue(cursor, [k], v), k, cursor);
			}, reverse) : 0;
		}
	}, {
		key: '__iterator',
		value: function __iterator(type, reverse) {
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
	}]);

	return KeyedCursor;
})(_immutable.Seq.Keyed);

exports['default'] = KeyedCursor;
module.exports = exports['default'];