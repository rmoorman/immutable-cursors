import { Iterable, Map } from 'immutable';
import IndexedCursor from './IndexedCursor';
import KeyedCursor from './KeyedCursor';

const NOT_SET = {};

export default class API {

	cursorFrom(rootData, keyPath = [], onChange = () => {}) {
		keyPath = this.valToKeyPath(keyPath);
		return this.makeCursor(rootData, keyPath, onChange, undefined);
	}

	getCursorClass(value) {
		return Iterable.isIndexed(value) ? IndexedCursor : KeyedCursor;
	}

	makeCursor(rootData, keyPath, onChange, value, CursorClass) {
		if (!value) {
			value = rootData.getIn(keyPath);
		}
		let size = value && value.size;
		CursorClass = CursorClass || this.getCursorClass(value);
		return new CursorClass(rootData, keyPath, onChange, size, this);
	}

	updateCursor(cursor, changeFn, changeKeyPath) {
		let deepChange = arguments.length > 2;
		let newRootData = cursor._rootData.updateIn(
			cursor._keyPath,
			deepChange ? new Map() : undefined,
			changeFn
		);
		let keyPath = cursor._keyPath || [];
		let result = cursor._onChange && cursor._onChange.call(
			undefined,
			newRootData,
			cursor._rootData,
			deepChange ? this.newKeyPath(keyPath, changeKeyPath) : keyPath
		);
		if (result !== undefined) {
			newRootData = result;
		}
		return this.makeCursor(newRootData, cursor._keyPath, cursor._onChange, undefined, cursor.constructor);
	}

	get NOT_SET() {
		return NOT_SET;
	}

	valToKeyPath(val) {
		return Array.isArray(val) ? val :
			Iterable.isIterable(val) ? val.toArray() :
			[val];
	}

	listToKeyPath(list) {
		return Array.isArray(list) ? list : new Iterable(list).toArray();
	}

	newKeyPath(head, tail) {
		return head.concat(this.listToKeyPath(tail));
	}

	wrappedValue(cursor, keyPath, value) {
		return Iterable.isIterable(value) ? this.subCursor(cursor, keyPath, value) : value;
	}

	subCursor(cursor, keyPath, value) {
		return this.makeCursor(
			cursor._rootData,
			this.newKeyPath(cursor._keyPath, keyPath),
			cursor._onChange,
			value
		);
	}
}
