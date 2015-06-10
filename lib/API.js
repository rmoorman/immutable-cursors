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

var NOT_SET = {};

var API = (function () {
	function API() {
		_classCallCheck(this, API);
	}

	_createClass(API, [{
		key: 'cursorFrom',
		value: function cursorFrom(rootData) {
			var keyPath = arguments[1] === undefined ? [] : arguments[1];
			var onChange = arguments[2] === undefined ? function () {} : arguments[2];

			keyPath = this.valToKeyPath(keyPath);
			return this.makeCursor(rootData, keyPath, onChange, undefined);
		}
	}, {
		key: 'getCursorClass',
		value: function getCursorClass(value) {
			return _immutable.Iterable.isIndexed(value) ? _IndexedCursor2['default'] : _KeyedCursor2['default'];
		}
	}, {
		key: 'makeCursor',
		value: function makeCursor(rootData, keyPath, onChange, value, CursorClass) {
			if (!value) {
				value = rootData.getIn(keyPath);
			}
			var size = value && value.size;
			CursorClass = CursorClass || this.getCursorClass(value);
			return new CursorClass(rootData, keyPath, onChange, size, this);
		}
	}, {
		key: 'updateCursor',
		value: function updateCursor(cursor, changeFn, changeKeyPath) {
			var deepChange = arguments.length > 2;
			var newRootData = cursor._rootData.updateIn(cursor._keyPath, deepChange ? new _immutable.Map() : undefined, changeFn);
			var keyPath = cursor._keyPath || [];
			var result = cursor._onChange && cursor._onChange.call(undefined, newRootData, cursor._rootData, deepChange ? this.newKeyPath(keyPath, changeKeyPath) : keyPath);
			if (result !== undefined) {
				newRootData = result;
			}
			return this.makeCursor(newRootData, cursor._keyPath, cursor._onChange, undefined, cursor.constructor);
		}
	}, {
		key: 'valToKeyPath',
		value: function valToKeyPath(val) {
			return Array.isArray(val) ? val : _immutable.Iterable.isIterable(val) ? val.toArray() : [val];
		}
	}, {
		key: 'listToKeyPath',
		value: function listToKeyPath(list) {
			return Array.isArray(list) ? list : new _immutable.Iterable(list).toArray();
		}
	}, {
		key: 'newKeyPath',
		value: function newKeyPath(head, tail) {
			return head.concat(this.listToKeyPath(tail));
		}
	}, {
		key: 'wrappedValue',
		value: function wrappedValue(cursor, keyPath, value) {
			return _immutable.Iterable.isIterable(value) ? this.subCursor(cursor, keyPath, value) : value;
		}
	}, {
		key: 'subCursor',
		value: function subCursor(cursor, keyPath, value) {
			return this.makeCursor(cursor._rootData, this.newKeyPath(cursor._keyPath, keyPath), cursor._onChange, value);
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