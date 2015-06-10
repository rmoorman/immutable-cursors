'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _API = require('./API');

var _API2 = _interopRequireDefault(_API);

var _KeyedCursor = require('./KeyedCursor');

var _KeyedCursor2 = _interopRequireDefault(_KeyedCursor);

var _IndexedCursor = require('./IndexedCursor');

var _IndexedCursor2 = _interopRequireDefault(_IndexedCursor);

var api = new _API2['default']();

exports['default'] = {
	from: api.cursorFrom.bind(api),
	KeyedCursor: _KeyedCursor2['default'],
	IndexedCursor: _IndexedCursor2['default'],
	api: api,
	API: _API2['default']
};
module.exports = exports['default'];