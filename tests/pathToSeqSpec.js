import pathToSeq from '../src/pathToSeq';
import { Seq } from 'immutable';

describe('function `pathToSeq`', () => {
	it('converts an array of keys to a Seq.', () => {
		let path = pathToSeq(['my', 'path']);
		expect(Seq.isSeq(path)).toBeTruthy();
	});

	it('converts a single string into a Seq.', () => {
		let path = pathToSeq('myKey');
		expect(Seq.isSeq(path)).toBeTruthy();
	});
});
