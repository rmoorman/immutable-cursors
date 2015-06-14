'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _immutable = require('immutable');

var _BaseCursor = require('./BaseCursor');

var _BaseCursor2 = _interopRequireDefault(_BaseCursor);

var _extendMixedJs = require('./extendMixed.js');

var _extendMixedJs2 = _interopRequireDefault(_extendMixedJs);

var IndexedCursor = (function (_mixed) {
	function IndexedCursor(rootData, keyPath, onChange, size, api, sharedOptions) {
		_classCallCheck(this, IndexedCursor);

		_get(Object.getPrototypeOf(IndexedCursor.prototype), 'constructor', this).call(this);
		this._api = api;
		this.size = size;
		this._keyPath = this._api.path(keyPath);
		this._rootData = rootData;
		this._onChange = onChange;
		this._sharedOptions = sharedOptions;
	}

	_inherits(IndexedCursor, _mixed);

	_createClass(IndexedCursor, [{
		key: 'toString',
		value: function toString() {
			return this.__toString('IndexedCursor {', '}');
		}
	}, {
		key: 'push',
		value: function push() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return this._api.updateCursor(this, function (m) {
				return m.push.apply(m, args);
			});
		}
	}, {
		key: 'pop',
		value: function pop() {
			return this._api.updateCursor(this, function (m) {
				return m.pop();
			});
		}
	}, {
		key: 'unshift',
		value: function unshift() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			return this._api.updateCursor(this, function (m) {
				return m.unshift.apply(m, args);
			});
		}
	}, {
		key: 'shift',
		value: function shift() {
			return this._api.updateCursor(this, function (m) {
				return m.shift();
			});
		}
	}]);

	return IndexedCursor;
})((0, _extendMixedJs2['default'])(_immutable.Seq.Indexed, _BaseCursor2['default']));

exports['default'] = IndexedCursor;
module.exports = exports['default'];