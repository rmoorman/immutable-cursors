import { Seq } from 'immutable';
import BaseCursor from './BaseCursor';
import mixed from './extendMixed.js';

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
