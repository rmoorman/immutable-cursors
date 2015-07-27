'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _API = require('./API');

/**
 *
 * ### *module* immutable-cursors
 *
 * The public API
 *
 */

/**
 * @id from
 * @lookup Cursor.from
 *
 * #### function from
 *
 * Returns a new cursor for the given state and key path.
 *
 *
 * ###### Signature:
 * ```js
 * from(
 *    state: Immutable.Iterable,
 *    keyPath?: Array<String>|Immutable.Seq,
 *    changeHandler?: Function
 * ): KeyedCursor|IndexedCursor
 * ```
 *
 * ###### Arguments:
 * * `state` - The root state.
 * * `keyPath` - The key path that points to the nested state you want to create a cursor for.
 * * `changeHandler` - A change handler function that gets called whenever changes occur on the cursor itself or on any sub-cursor. Its return value, if `!== undefined`, will replace `newState` as new root state of the resulting cursors shared state. It gets called with:
 *    * `newState` - The state *after* the update.
 *    * `oldState` - The state *before* the update.
 *    * `keyPath` - An Immutable.Seq key path that indicates where in the state the update occurred.
 *
 * ###### Returns
 * A new root cursor
 */

var _API2 = _interopRequireDefault(_API);

var api = new _API2['default']();
exports['default'] = api['export']();
module.exports = exports['default'];