import { Seq } from 'immutable';
import BaseCursor from './BaseCursor';
import mixed from './extendMixed.js';

/**
 * @id IndexedCursor
 * @lookup IndexedCursor
 *
 * ### *class* IndexedCursor
 *
 * <sub>**Extends:** >IndexedSeq</sub>
 *
 * <sub>**Mixins:** >BaseCursor</sub>
 *
 * Used to represent indexed >ImmutableJS values.
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
export default class IndexedCursor extends mixed(Seq.Indexed, BaseCursor) {

	constructor(rootData, keyPath, onChange, size, api, sharedOptions) {
		super();
		this._api = api;
		this.size = size;
		this._keyPath = this._api.path(keyPath);
		this._rootData = rootData;
		this._onChange = onChange;
		this._sharedOptions = sharedOptions;
	}

	toString() {
		return this.__toString('IndexedCursor {', '}');
	}

	push(...args) {
		return this._api.updateCursor(this, (m) => {
			return m.push.apply(m, args);
		});
	}

	pop() {
		return this._api.updateCursor(this, (m) => {
			return m.pop();
		});
	}

	unshift(...args) {
		return this._api.updateCursor(this, (m) => {
			return m.unshift.apply(m, args);
		});
	}

	shift() {
		return this._api.updateCursor(this, (m) => {
			return m.shift();
		});
	}
}
