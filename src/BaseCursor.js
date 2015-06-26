import { Iterable, Map } from 'immutable';

let Iterator = Iterable.Iterator;

/**
 * @id BaseCursor
 * @lookup BaseCursor
 *
 * ## *mixin* BaseCursor
 *
 * The BaseCursor mixin contains methods that represent shared behavior of
 * both >KeyedCursor and >IndexedCursor. The reason why these live in a mixin is,
 * that prototypical inheritance on the cursor classes is already occupied by the
 * ImmutableJS base classes KeyedSeq and IndexedSeq respectively.
 *
 * Most of the methods in this mixin override these original Immutable.Seq interface, where
 * cursor implementation has to decorate / circumvent default ImmutableJS behavior.
 *
 *
 * If your are interested in how these overrides work, check out the source. This
 * document only lists the methods that are not part of the original ImmutableJS.Seq
 * interface.
 */
export default {

	size: undefined,
	_rootData: undefined,
	_keyPath: undefined,
	_onChange: undefined,
	_api: undefined,
	_sharedOptions: undefined,

	/**
	 * #### deref()
	 *
	 * Returns the ImmutableJS object that is backing the cursor.
	 *
	 * ###### Signature:
	 * ```js
	 * deref(
	 *    notSetValue?: any
	 * ): Immutable.Iterable
	 * ```
	 *
	 * ###### Arguments:
	 * * `notSetValue` - You'll get `notSetValue` returned if there is no backing value for this cursor.
	 *
	 * ###### Returns:
	 * The ImmutableJS backing state of this cursor.
	 */
	deref(notSetValue) {
		return this._rootData.getIn(this._keyPath, notSetValue);
	},

	/**
	 * #### valueOf()
	 *
	 * Alias of deref().
	 */
	valueOf(notSetValue = undefined) {
		return this.deref(notSetValue);
	},

	get(key, notSetValue = undefined) {
		return this.getIn(this._api.path(key), notSetValue);
	},

	getIn(keyPath, notSetValue = undefined) {
		keyPath = this._api.path(keyPath);
		if (keyPath.size === 0) {
			return this;
		}
		let value = this._rootData.getIn(this._api.path(this._keyPath, keyPath), this._api.NOT_SET);
		return value === this._api.NOT_SET ? notSetValue : this._api.wrappedValue(this, keyPath, value);
	},

	set(key, value) {
		return this._api.updateCursor(this, (m) => {
			return m.set(key, value);
		}, this._api.path(key));
	},

	setIn(keyPath, value) {
		keyPath = this._api.path(keyPath);
		return Map.prototype.setIn.call(this, keyPath, value);
	},

	delete(key) {
		return this._api.updateCursor(this, (m) => {
			return m.remove(key);
		}, this._api.path(key));
	},

	remove(key) {
		return this.delete(key);
	},

	deleteIn(keyPath) {
		return Map.prototype.deleteIn.call(this, this._api.path(keyPath));
	},

	removeIn(keyPath) {
		return this.deleteIn(this._api.path(keyPath));
	},

	clear() {
		return this._api.updateCursor(this, (m) => {
			return m.clear();
		});
	},

	update(keyOrFn, notSetValue = undefined, updater = undefined) {
		return !updater ?
			this._api.updateCursor(this, keyOrFn) :
			this.updateIn(this._api.path(keyOrFn), notSetValue, updater);
	},

	updateIn(keyPath, notSetValue, updater) {
		keyPath = this._api.path(keyPath);
		return this._api.updateCursor(this, (m) => {
			return m.updateIn(keyPath, notSetValue, updater);
		}, keyPath);
	},

	merge(...iterables) {
		return this._api.updateCursor(this, (m) => {
			return m.merge.apply(m, iterables);
		});
	},

	mergeWith(merger, ...iterables) {
		return this._api.updateCursor(this, (m) => {
			return m.mergeWith.call(m, merger, ...iterables);
		});
	},

	mergeIn(keyPath, ...iterables) {
		return Map.prototype.mergeIn.call(this, this._api.path(keyPath), ...iterables);
	},

	mergeDeep(...iterables) {
		return this._api.updateCursor(this, (m) => {
			return m.mergeDeep.apply(m, iterables);
		});
	},

	mergeDeepWith(merger, ...iterables) {
		return this._api.updateCursor(this, (m) => {
			return m.mergeDeepWith.call(m, merger, ...iterables);
		});
	},

	mergeDeepIn(keyPath, ...iterables) {
		return Map.prototype.call(this, this._api.path(keyPath), ...iterables);
	},

	withMutations(fn) {
		return this._api.updateCursor(this, (m) => {
			return (m || new Map()).withMutations(fn);
		});
	},

	cursor(subKeyPath) {
		subKeyPath = this._api.path(subKeyPath);
		return subKeyPath.size === 0 ? this : this._api.subCursor(this, subKeyPath);
	},

	__iterate(fn, reverse) {
		let cursor = this;
		let deref = cursor.deref();
		return deref && deref.__iterate ? deref.__iterate(
			(v, k) => {
				return fn(this._api.wrappedValue(cursor, [k], v), k, cursor);
			},
			reverse
		) : 0;
	},

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
};
