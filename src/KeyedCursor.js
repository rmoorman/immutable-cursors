import { Seq } from 'immutable';
import BaseCursor from './BaseCursor';
import mixed from './extendMixed.js';

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
