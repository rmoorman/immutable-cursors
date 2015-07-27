'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _immutable = require('immutable');

var _BaseCursor = require('./BaseCursor');

var _BaseCursor2 = _interopRequireDefault(_BaseCursor);

var _extendMixedJs = require('./extendMixed.js');

/**
 * @id KeyedCursor
 * @lookup KeyedCursor
 *
 * ### *class* KeyedCursor
 *
 * <sub>**Extends:** >KeyedSeq</sub>
 * <sub>**Mixins:** >BaseCursor</sub>
 *
 * Used to represent keyed >ImmutableJS values.
 *
 * ###### Signature:
 * ```js
 * new IndexedCursor(
 *    rootData: immutable.Iterable,
 *    keyPath: Immutable.Seq,
 *    onChange?: Function,
 *    size?: number,
 *    api: API,
 *    sharedOptions?: Object
 * )
 * ```
 *
 * ###### Arguments:
 * * `rootData` - An >ImmutableJS state.
 * * `keyPath` - A key path to a nested value.
 * * `onChange` - A change handler.
 * * `size` -  A value that should be set as the size of the cursor. Default: `rootData.getIn(keyPath)`.
 * * `api` - A reference to the >API object from which the cursor was derived.
 * * `sharedOptions` - Pass additional shared options.
 *
 * ###### Returns:
 * * A new cursor
 */

var _extendMixedJs2 = _interopRequireDefault(_extendMixedJs);

var KeyedCursor = (function (_mixed) {
  _inherits(KeyedCursor, _mixed);

  function KeyedCursor(rootData, keyPath, onChange, size, api, sharedOptions) {
    _classCallCheck(this, KeyedCursor);

    _get(Object.getPrototypeOf(KeyedCursor.prototype), 'constructor', this).call(this);
    this.size = size;
    this._api = api;
    this._keyPath = this._api.path(keyPath);
    this._rootData = rootData;
    this._onChange = onChange;
    this._sharedOptions = sharedOptions;
  }

  _createClass(KeyedCursor, [{
    key: 'toString',
    value: function toString() {
      return this.__toString('KeyedCursor {', '}');
    }
  }]);

  return KeyedCursor;
})((0, _extendMixedJs2['default'])(_immutable.Seq.Keyed, _BaseCursor2['default']));

exports['default'] = KeyedCursor;
module.exports = exports['default'];