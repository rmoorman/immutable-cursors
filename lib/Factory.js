'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Iterable$Map = require('immutable');

var _IndexedCursor = require('./IndexedCursor');

var _IndexedCursor2 = _interopRequireDefault(_IndexedCursor);

var _KeyedCursor = require('./KeyedCursor');

var _KeyedCursor2 = _interopRequireDefault(_KeyedCursor);

var Context = (function () {
	function Context() {
		var _ref = arguments[0] === undefined ? {} : arguments[0];

		var notSet = _ref.notSet;
		var cursorFactories = _ref.cursorFactories;

		_classCallCheck(this, Context);

		this._notSet = notSet || {};
		this._cursorFactories = (cursorFactories || []).concat(function (value) {
			return _Iterable$Map.Iterable.isIndexed(value) ? _IndexedCursor2['default'] : undefined;
		}, function () {
			return _KeyedCursor2['default'];
		});
	}

	_createClass(Context, [{
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
			var cursorClass = undefined;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._cursorFactories[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var factory = _step.value;

					cursorClass = factory(value);
					if (cursorClass) {
						break;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return cursorClass;
		}
	}, {
		key: 'makeCursor',
		value: function makeCursor(rootData, keyPath, onChange) {
			var value = arguments[3] === undefined ? undefined : arguments[3];

			if (!value) {
				value = rootData.getIn(keyPath);
			}
			var size = value && value.size;
			var CursorClass = this.getCursorClass(value);
			return new CursorClass(rootData, keyPath, onChange, size, this);
		}
	}, {
		key: 'updateCursor',
		value: function updateCursor(cursor, changeFn, changeKeyPath) {
			var deepChange = arguments.length > 2;
			var newRootData = cursor._rootData.updateIn(cursor._keyPath, deepChange ? _Iterable$Map.Map() : undefined, changeFn);
			var keyPath = cursor._keyPath || [];
			var result = cursor._onChange && cursor._onChange.call(undefined, newRootData, cursor._rootData, deepChange ? this.newKeyPath(keyPath, changeKeyPath) : keyPath);
			if (result !== undefined) {
				newRootData = result;
			}
			return this.makeCursor(newRootData, cursor._keyPath, cursor._onChange);
		}
	}, {
		key: 'NOT_SET',
		get: function () {
			return this._notSet;
		}
	}, {
		key: 'valToKeyPath',
		value: function valToKeyPath(val) {
			return Array.isArray(val) ? val : _Iterable$Map.Iterable.isIterable(val) ? val.toArray() : [val];
		}
	}, {
		key: 'listToKeyPath',
		value: function listToKeyPath(list) {
			return Array.isArray(list) ? list : _Iterable$Map.Iterable(list).toArray();
		}
	}, {
		key: 'newKeyPath',
		value: function newKeyPath(head, tail) {
			return head.concat(this.listToKeyPath(tail));
		}
	}, {
		key: 'wrappedValue',
		value: function wrappedValue(cursor, keyPath, value) {
			return _Iterable$Map.Iterable.isIterable(value) ? this.subCursor(cursor, keyPath, value) : value;
		}
	}, {
		key: 'subCursor',
		value: function subCursor(cursor, keyPath, value) {
			return this.makeCursor(cursor._rootData, this.newKeyPath(cursor._keyPath, keyPath), cursor._onChange, value);
		}
	}]);

	return Context;
})();

exports['default'] = Context;
module.exports = exports['default'];