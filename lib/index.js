'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _API = require('./API');

var _API2 = _interopRequireDefault(_API);

var api = new _API2['default']();
exports['default'] = api['export']();
module.exports = exports['default'];