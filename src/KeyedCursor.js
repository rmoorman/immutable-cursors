import { Seq } from 'immutable';
import BaseCursor from './BaseCursor';
import mixed from './extendMixed.js';

/**
 * @id KeyedCursor
 * @lookup KeyedCursor
 *
 * ### *class* KeyedCursor
 *
 * <sub>**Extends:** >KeyedSeq</sub>
 * 
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
export default class KeyedCursor extends mixed(Seq.Keyed, BaseCursor) {

	constructor(rootData, keyPath, onChange, size, api, sharedOptions) {
		super();
		this.size = size;
		this._api = api;
		this._keyPath = this._api.path(keyPath);
		this._rootData = rootData;
		this._onChange = onChange;
		this._sharedOptions = sharedOptions;
	}

	toString() {
		return this.__toString('KeyedCursor {', '}');
	}
}
