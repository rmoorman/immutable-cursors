import {
	Iterable,
	Seq,
	Map
} from 'immutable';

let Iterator = Iterable.Iterator;

export default class IndexedCursor extends Seq.Indexed {

	size;
	_rootData;
	_keyPath;
	_onChange;
	_api;

	constructor(rootData, keyPath, onChange, size, api) {
		super();
		this.size = size;
		this._rootData = rootData;
		this._keyPath = keyPath;
		this._onChange = onChange;
		this._api = api;
	}

	toString() {
		return this.__toString('IndexedCursor {', '}');
	}

	deref(notSetValue = undefined) {
		return this._rootData.getIn(this._keyPath, notSetValue);
	}

	valueOf(notSetValue = undefined) {
		return this.deref(notSetValue);
	}

	get(key, notSetValue = undefined) {
		return this.getIn([key], notSetValue);
	}

	getIn(keyPath, notSetValue = undefined) {
		keyPath = this._api.listToKeyPath(keyPath);
		if (keyPath.length === 0) {
			return this;
		}
		let value = this._rootData.getIn(this._api.newKeyPath(this._keyPath, keyPath), this._api.NOT_SET);
		return value === this._api.NOT_SET ? notSetValue : this._api.wrappedValue(this, keyPath, value);
	}

	set(key, value) {
		return this._api.updateCursor(this, (m) => {
			return m.set(key, value);
		}, [key]);
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

	setIn(keyPath, value) {
		return Map.prototype.setIn.call(this, keyPath, value);
	}

	delete(key) {
		return this._api.updateCursor(this, (m) => {
			return m.remove(key);
		}, [key]);
	}

	remove(key) {
		return this.delete(key);
	}

	deleteIn(keyPath) {
		return Map.prototype.deleteIn.call(this, keyPath);
	}

	removeIn(keyPath) {
		return this.deleteIn(keyPath);
	}

	clear() {
		return this._api.updateCursor(this, (m) => {
			return m.clear();
		});
	}

	update(keyOrFn, notSetValue = undefined, updater = undefined) {
		return !updater ?
			this._api.updateCursor(this, keyOrFn) :
			this.updateIn([keyOrFn], notSetValue, updater);
	}

	updateIn(keyPath, notSetValue, updater) {
		return this._api.updateCursor(this, (m) => {
			return m.updateIn(keyPath, notSetValue, updater);
		}, keyPath);
	}

	merge(...iterables) {
		return this._api.updateCursor(this, (m) => {
			return m.merge.apply(m, iterables);
		});
	}

	mergeWith(merger, ...iterables) {
		return this._api.updateCursor(this, (m) => {
			return m.mergeWith.call(m, merger, ...iterables);
		});
	}

	mergeIn(keyPath, ...iterables) {
		return Map.prototype.mergeIn.call(this, keyPath, ...iterables);
	}

	mergeDeep(...iterables) {
		return this._api.updateCursor(this, (m) => {
			return m.mergeDeep.apply(m, iterables);
		});
	}

	mergeDeepWith(merger, ...iterables) {
		return this._api.updateCursor(this, (m) => {
			return m.mergeDeepWith.call(m, merger, ...iterables);
		});
	}

	mergeDeepIn(keyPath, ...iterables) {
		return Map.prototype.call(this, keyPath, ...iterables);
	}

	withMutations(fn) {
		return this._api.updateCursor(this, (m) => {
			return (m || new Map()).withMutations(fn);
		});
	}

	cursor(subKeyPath) {
		subKeyPath = this._api.valToKeyPath(subKeyPath);
		return subKeyPath.length === 0 ? this : this._api.subCursor(this, subKeyPath);
	}

	__iterate(fn, reverse) {
		let cursor = this;
		let deref = cursor.deref();
		return deref && deref.__iterate ? deref.__iterate(
			(v, k) => {
				return fn(this._api.wrappedValue(cursor, [k], v), k, cursor);
			},
			reverse
		) : 0;
	}

	__iterator(type, reverse) {
		let deref = this.deref();
		let cursor = this;
		let iterator = deref && deref.__iterator &&
			deref.__iterator(Iterator.ENTRIES, reverse);
		return new Iterator(() => {
			if (!iterator) {
				return { value: undefined, done: true };
			}
			let step = iterator.next();
			if (step.done) {
				return step;
			}
			let entry = step.value;
			let k = entry[0];
			let v = this._api.wrappedValue(cursor, [k], entry[1]);
			return {
				value: type === Iterator.KEYS ? k : type === Iterator.VALUES ? v : [k, v],
				done: false
			};
		});
	}
}
