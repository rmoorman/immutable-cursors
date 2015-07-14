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

/**
 * @id API
 * @lookup API
 *
 * ### *class* API
 *
 * The main entry point for both client and internals. If you create a new cursor using an >API object, a reference of it will get passed to every (sub-)cursor you create from the initial one.
 *
 * It consists mainly of refactored versions of the non-prototypical private functions found in >ImmutableJS's >contrib/cursor.
 *
 * I made them sit in a class construct for extendibility and testability reasons. That way, one can easily roll his/her custom logic by subclassing from >API.
 *
 * The downsides of this approach are that every cursor has to carry another few more references and that more importantly the internal API is not really private anymore.
 * ```js
 * let cursor = Cursor.from(state, ['data']);
 * messWithInternals(cursor._api);
 * ```
 *
 * >API objects, in contrary to >contrib/cursor, convert key path arrays to >Immutable.Seq objects internally. This is perfectly fine with the >ImmutableJS way of working on nested values and gives a couple of handy methods to work on key paths on top of another level of security because key paths are immutable as well.
 *
 * **Extending**
 * The following example shows how you could establish access of nested cursors by using dot-string formatted key paths as well.
 * ```js
 * import API from 'immutable-cursors/lib/API';
 *
 * class CustomAPI extends API {
 *    path(...paths) {
 *       if (paths.length === 1 && typeof paths[0] === 'string') {
 *          paths = paths[0].split('.');
 *       }
 *       return super.path(...paths);
 *    }
 * }
 *
 * let api = new CustomAPI();
 * export default api.export();
 * ```
 */

var API = (function () {
	function API() {
		_classCallCheck(this, API);
	}

	_createClass(API, [{
		key: 'cursorFrom',

		/**
   * @id API-cursorFrom
   * @lookup cursorFrom
   *
   * #### cursorFrom()
   *
   * Returns a new default cursor.
   *
   * ###### Signature:
   * ```js
   * cursorFrom(
   *    rootData: Immutable.Iterable,
   *    keyPath?: Immutable.Seq|Array<string>,
   *    onChange?: Function
   * ): KeyedCursor|IndexedCursor
   *```
   *
   * ###### Arguments:
   * * `rootData` - The state.
   * * `keyPath` - An optional key path to a substate.
   * * `onChange` - An optional change handler.
   *
   * ###### Returns:
   * * A new cursor.
   */
		value: function cursorFrom(rootData, keyPath, onChange) {
			keyPath = this.path(keyPath);
			return this.makeCursor(rootData, keyPath, onChange);
		}
	}, {
		key: 'getCursorClass',

		/**
   * @id API-getCursorClass
   * @lookup getCursorClass
   *
   * #### getCursorClass()
   *
   * Decides on and returns a cursor class by analyzing `value`. Returns >IndexedCursor if `Iterable.isIndexed(value) === true`, else >KeyedCursor.
   *
   * ###### Signature:
   * ```js
   * getCursorClass(
   *    value: Immutable.Iterable
   * ): Function
   * ```
   *
   * ###### Arguments:
   * * `value` - Any value in your state.
   *
   * ###### Returns:
   * * The class that should be used to create a new cursor for `value`.
   */
		value: function getCursorClass(value) {
			return _immutable.Iterable.isIndexed(value) ? _IndexedCursor2['default'] : _KeyedCursor2['default'];
		}
	}, {
		key: 'makeCursor',

		/**
   * @id API-makeCursor
   * @lookup makeCursor
   *
   * #### makeCursor()
   *
   * This is the main cursor factory. You probably should not subclass this method as it gives you all the options you need through its arguments. Instead of subclassing it, you should write your own method and call >makeCursor from there with your custom values.
   *
   * **Enforce a custom cursor class**
   * ```js
   * class CustomAPI extends API {
   *    getCustomCursor(rootData, keyPath, onChange) {
   *       return this.makeCursor(rootData, keyPath, onChange, undefined, MyCustomCursorClass);
   *    }
   *
   *    export() {
   *       let api = super.export();
   *       api.getCustom = this.getCustomCursor.bind(this);
   *       return api;
   *    }
   * }
   *
   * let api = new CustomAPI();
   * export default api.export();
   * ```
   *
   * **Equip cursors with shared options**
   * Some of the cursor properties like the change handler or the root data will get shared between all cursors that are derived from the same initial cursor, may it be through updating or retrieving a cursor to a nested state etc. In certain situations it might be helpful to have custom shared values in place.
   * ```js
   * class CustomAPI extends API {
   *    getWithSharedName(rootData, keyPath, onChange, name) {
   *       return this.makeCursor(rootData, keyPath, onChange, undefined, undefined, {
   *          name: name
   *       });
   *    }
   *
   *    export() {
   *       let api = super.export();
   *       api.getWithSharedName = this.getWithSharedName.bind(this);
   *       return api;
   *    }
   * }
   *
   * let api = new CustomAPI();
   * let cursor = api.getWithSharedName(Immutable.fromJS({foo: 'bar'}), [], undefined, 'fooCursor');
   *
   * cursor._sharedOptions.name;
   * // 'fooCursor'
   *
   * cursor.set('foo', 'baz')._sharedOptions.name;
   * // 'fooCursor'
   *
   * cursor.cursor('foo')._sharedOptions.name;
   * // 'fooCursor'
   * ```
   *
   * ###### Signature:
   * ```js
  	 * makeCursor(
  	 *    rootData: Immutable.Iterable,
  	 *    keyPath?: Immutable.Seq,
  	 *    onChange?: Function,
  	 *    value?: Immutable.Iterable|any,
  	 *    CursorClass?: Function,
  	 *    sharedOptions?: Object
  	 * ): KeyedCursor|IndexedCursor
   * ```
   *
   * ###### Arguments:
   * * `rootData` - An >ImmutableJS state.
   * * `keyPath` - A key path to a nested value.
   * * `onChange` - A change handler.
   * * `value` -  A value to determine the size and the `CursorClass` if not present. Default: `rootData.getIn(keyPath)`.
   * * `CursorClass` - Enforce a custom class to create the cursor with.
   * * `sharedOptions` - Pass additional shared options.
   *
   * ###### Returns:
   * * A new cursor
   */
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

		/**
   * @id API-updateCursor
   * @lookup updateCursor
   *
   * #### updateCursor()
   *
   * Updates the current state with `changeFn` and calls the cursors change handler. Returns a new cursor backed by either the return value of the change handler or the result of `changeFn`.
   *
   * ###### Signature:
   * ```js
   * updateCursor(
   *    cursor: KeyedCursor|IndexedCursor,
   *    changeFn: Function,
   *    changeKeyPath?: Immutable.Seq
   * ): KeyedCursor|IndexedCursor
   * ```
   *
   * ###### Arguments:
   * * `cursor` - The cursor to update.
   * * `changeFn` -  A function that performs and returns modifications on the given state.
   * * `changeKeyPath` - If present, indicates a deep change.
   *
   * ###### Returns:
   * * An new updated cursor.
   */
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

		/**
   * @id API-wrappedValue
   * @lookup wrappedValue
   *
   * #### wrappedValue()
   *
   * Returns a sub-cursor if the given value is an >Immutable.Iterable.
   * If not, returns the value itself.
   *
   * ###### Signature:
   * ```js
   * wrappedValue(
   *    cursor: KeyedCursor|IndexedCursor,
   *    keyPath: Immutable.Seq,
   *    value: Immutable.isIterable|any
   * ): KeyedCursor|IndexedCursor|any
   * ```
   *
   * ###### Arguments:
   * * `cursor` - A cursor from which you want to retrieve a sub-cursor in case of `>Iterable.isIterable(value)`.
   * * `keyPath` - The key path where the value resides.
   * * `value` - The value to analyze.
   *
   * ###### Returns:
   * A sub-cursor or the value.
   */
		value: function wrappedValue(cursor, keyPath, value) {
			return _immutable.Iterable.isIterable(value) ? this.subCursor(cursor, keyPath, value) : value;
		}
	}, {
		key: 'subCursor',

		/**
   * @id API-subCursor
   * @lookup subCursor
   *
   * #### subCursor()
   *
   * Creates and returns a sub-cursor of `cursor` at `keyPath`.
   *
   * ###### Signature:
   * ```js
   * subCursor(
   *    cursor: KeyedCursor|IndexedCursor,
   *    keyPath: Immutable.Seq,
   *    value: any
   * )
   * ```
   *
   * ###### Arguments:
   * * `cursor` - The cursor you want to create a sub-cursor from.
   * * `keyPath` - The key path to the state your sub-cursor should point at.
   * * `value` - The value at `keyPath`.
   *
   * ###### Returns:
   * A new sub-cursor
   */
		value: function subCursor(cursor, keyPath, value) {
			return this.makeCursor(cursor._rootData, (0, _pathToSeq2['default'])(cursor._keyPath, keyPath), cursor._onChange, value, undefined, undefined);
		}
	}, {
		key: 'defineRecordProperties',

		/**
   * @id API-defineRecordProperties
   * @lookup defineRecordProperties
   *
   * #### defineRecordProperties()
   *
   * Extends a cursor with >Immutable.Record properties to export the same
   * interface as its backing value. Calls >setProp for each
   * property key.
   *
   * ###### Signature:
   * ```js
   * defineRecordProperties(
   *    cursor: KeyedCursor|IndexedCursor,
   *    value: Immutable.Record
   * ): KeyedCursor|IndexedCursor
   * ```
   * ###### Arguments:
   * * `cursor` - The cursor you want to extend.
   * * `value` - The >Immutable.Record object whose keys should get mapped on `cursor`.
   *
   * ###### Returns:
   * An extended cursor.
   */
		value: function defineRecordProperties(cursor, value) {
			value._keys.forEach(this.setProp.bind(undefined, cursor));
		}
	}, {
		key: 'setProp',

		/**
   * @id API-setProp
   * @lookup setProp
   *
   * #### setProp
   *
   * Defines an alias property on a cursor that delegates to `cursor.get(name)`.
   *
   * ###### Signature:
   * ```js
   * setProp(
   *    cursor: KeyedCursor|IndexedCursor,
   *    name: string
   * )
   * ```
   *
   * ###### Arguments:
   * * `cursor` - The cursor on which you want to have a getter property with name `name`.
   * * `name` - The name of the property
   */
		value: function setProp(cursor, name) {
			Object.defineProperty(cursor, name, {
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

		/**
   * @id API-path
   * @lookup path
   *
   * #### path()
   *
   * Normalizes and concatenates any passed key paths and returns a single
   * >Immutable.Seq object.
   *
   * See >pathToSeq
   *
   * ###### Signature:
   * ```js
   * path(
   *    ...paths: Array<Immutable.Seq|Array<string>|string>
   * ): Immutable.Seq
   * ```
   *
   * ###### Returns:
   * A concatenated, validated key path as >Immutable.Seq
   */
		value: function path() {
			return _pathToSeq2['default'].apply(undefined, arguments);
		}
	}, {
		key: 'export',

		/**
   * @id api-export
   * @lookup export
   *
   * #### export()
   *
   * Should return an object containing all (bound) functions and properties that
   * you consider public. Recommended use:
   * ```js
   * // in ./cursor/CustomAPI.js
   * import API from 'immutable-cursors/lib/API';
   *
   * export default class CustomAPI extends API {
   *    export() {
   *       let api = super.export();
   *       api.version = '0.1';
   *       return api;
   *    }
   * }
   *
   * // in ./cursor/index.js
   * import CustomAPI from './CustomAPI';
   *
   * let api = new CustomAPI();
   * export default api.export();
   *
   * // in ./client.js
   * import Cursor from './cursor';
   *
   * console.log(Cursor.version);
   * let cursor = Cursor.from(state);
   * ```
   *
   * ###### Signature:
   * ```js
   * export(): Object
   * ```
   *
   * ###### Returns:
   * The client API
   */
		value: function _export() {
			return {
				from: this.cursorFrom.bind(this)
			};
		}
	}, {
		key: 'NOT_SET',

		/**
   * @id API-NOT_SET
   * @lookup NOT_SET
   *
   * #### NOT_SET *[read-only]*
   *
   * Constant for attempts on nested undefined values.
   *
   * ###### Returns
   * An empty object.
   *
   */
		get: function get() {
			return NOT_SET;
		}
	}]);

	return API;
})();

exports['default'] = API;
module.exports = exports['default'];