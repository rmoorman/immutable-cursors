import Immutable from 'immutable';
import API from '../src/API';
import KeyedCursor from '../src/KeyedCursor';
import pathToSeq from '../src/pathToSeq';

function mock(name) {
	return jasmine.createSpyObj(name, ['exec']).exec;
}

describe('class `API`', () => {

	let json = { a: { b: { c: 1 } } };

	class Foo extends KeyedCursor {}

	describe('method `makeCursor`', () => {
		it('accepts and enforces a custom cursor class.', () => {
			let data = Immutable.fromJS(json);
			let api = new API();
			let cursor = api.makeCursor(data, [], undefined, undefined, Foo);
			expect(cursor instanceof Foo).toBeTruthy();
		});

		it('accepts and passes a shared options object.', () => {
			let data = Immutable.fromJS(json);
			let api = new API();
			let cursor = api.makeCursor(data, [], undefined, undefined, undefined, {foo: 'bar'});
			expect(cursor._sharedOptions.foo).toEqual('bar');
		});
	});

	describe('method `updateCursor`', () => {
		it('keeps the custom cursor type on the new cursor.', () => {
			let data = Immutable.fromJS(json);
			let api = new API();
			let cursor = api.makeCursor(data, [], undefined, undefined, Foo);
			cursor = cursor.set('foo', 'baz');
			expect(cursor instanceof Foo).toBeTruthy();
		});

		it('passes the shared options to the new cursor.', () => {
			let data = Immutable.fromJS(json);
			let api = new API();
			let cursor = api.makeCursor(data, [], undefined, undefined, undefined, {foo: 'bar'});
			cursor = cursor.set('foo', 'baz');
			expect(cursor._sharedOptions.foo).toEqual('bar');
		});
	});
});
