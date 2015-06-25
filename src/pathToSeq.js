import { Seq, Iterable } from 'immutable';

/**
 * @id pathToSeq
 * @lookup pathToSeq
 *
 * ## *function* pathToSeq()
 *
 * Normalizes and concatenates any passed key paths and returns a single
 * Immutable.Seq object.
 *
 * ###### Signature:
 * ```js
 * pathToSeq(
 * ...paths: Array<Immutable.Seq|Array<string>|string>
 * ): Immutable.Seq
 * ```
 *
 * ###### Arguments:
 * * `...paths` -  Any values that you want to merge to a Immutable.Seq path
 *
 * ###### Returns:
 * An Immutable.Seq path
 */
export default function pathToSeq(...paths) {
	return (
		paths.length === 0 ?
			new Seq() :
		paths.length === 1 && Iterable.isIterable(paths[0]) ?
			paths[0] :
			paths.reduce((memo, value) => {
				return typeof value === 'undefined' ?
					memo :
					memo.concat(value);
			}, new Seq())
	);
}
