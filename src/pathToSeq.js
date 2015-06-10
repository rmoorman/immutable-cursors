import { Seq, Iterable } from 'immutable';

export default function pathToSeq(...paths): Seq {
	return (
		paths.length === 0 ?
			new Seq() :
		paths.length === 1 && Iterable.isIterable(paths[0]) ?
			paths[0] :
			paths.reduce((memo, value) => {
				return typeof value === 'undefined' ?
						memo :
					memo.concat(
						Iterable.isIterable(value) || Array.isArray(value) ?
							value :
							value.split('.')
					);
			}, new Seq())
	);
}
