'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _immutable = require('immutable');

var _IndexedCursor = require('./IndexedCursor');

var _IndexedCursor2 = _interopRequireDefault(_IndexedCursor);

var _KeyedCursor = require('./KeyedCursor');

var _KeyedCursor2 = _interopRequireDefault(_KeyedCursor);

var _pathToSeq = require('./pathToSeq');

var _pathToSeq2 = _interopRequireDefault(_pathToSeq);

var NOT_SET = {};

var API = (function () {
	function API() {
		_classCallCheck(this, API);
	}

	_createClass(API, [{
		key: 'cursorFrom',
		value: function cursorFrom(rootData, keyPath, onChange) {
			keyPath = this.path(keyPath);
			return this.makeCursor(rootData, keyPath, onChange);
		}
	}, {
		key: 'getCursorClass',
		value: function getCursorClass(value) {
			return _immutable.Iterable.isIndexed(value) ? _IndexedCursor2['default'] : _KeyedCursor2['default'];
		}
	}, {
		key: 'makeCursor',
		value: function makeCursor(rootData, keyPath, onChange, value, CursorClass, sharedOptions) {
			keyPath = this.path(keyPath);
			if (!value) {
				value = rootData.getIn(keyPath);
			}
			var size = value && value.size;
			CursorClass = CursorClass || this.getCursorClass(value);
			var cursor = new CursorClass(rootData, keyPath, onChange, size, this, sharedOptions);

			if (value instanceof _immutable.Record) {
				this.defineRecordProperties(cursor, value);
			}

			return cursor;
		}
	}, {
		key: 'updateCursor',
		value: function updateCursor(cursor, changeFn, changeKeyPath) {
			var deepChange = arguments.length > 2;
			var newRootData = cursor._rootData.updateIn(cursor._keyPath, deepChange ? new _immutable.Map() : undefined, changeFn);
			var keyPath = cursor._keyPath;
			var result = cursor._onChange && cursor._onChange.call(undefined, newRootData, cursor._rootData, deepChange ? this.path(keyPath, changeKeyPath) : keyPath);
			if (result !== undefined) {
				newRootData = result;
			}
			return this.makeCursor(newRootData, cursor._keyPath, cursor._onChange, undefined, cursor.constructor, cursor._sharedOptions);
		}
	}, {
		key: 'wrappedValue',
		value: function wrappedValue(cursor, keyPath, value) {
			return _immutable.Iterable.isIterable(value) ? this.subCursor(cursor, keyPath, value) : value;
		}
	}, {
		key: 'subCursor',
		value: function subCursor(cursor, keyPath, value) {
			return this.makeCursor(cursor._rootData, (0, _pathToSeq2['default'])(cursor._keyPath, keyPath), cursor._onChange, value, undefined, undefined);
		}
	}, {
		key: 'defineRecordProperties',
		value: function defineRecordProperties(cursor, value) {
			value._keys.forEach(this.setProp.bind(undefined, cursor));
		}
	}, {
		key: 'setProp',
		value: function setProp(prototype, name) {
			Object.defineProperty(prototype, name, {
				get: function get() {
					return this.get(name);
				},
				set: function set() {
					if (!this.__ownerID) {
						throw new Error('Cannot set on an immutable record.');
					}
				}
			});
		}
	}, {
		key: 'path',
		value: function path() {
			for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
				paths[_key] = arguments[_key];
			}

			return _pathToSeq2['default'].apply(undefined, paths);
		}
	}, {
		key: 'export',
		value: function _export() {
			return {
				from: this.cursorFrom.bind(this)
			};
		}
	}, {
		key: 'NOT_SET',
		get: function () {
			return NOT_SET;
		}
	}]);

	return API;
})();

exports['default'] = API;
module.exports = exports['default'];