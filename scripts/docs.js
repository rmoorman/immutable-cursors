import { parse } from 'acorn';
import glob from 'glob';
import fs from 'fs';
import Mustache from 'mustache';
import pkg from '../package';

const tagExp = /@[a-z]+ (_|-|[a-zA-Z0-9]|\.)+/g;
const asteriskAndNewLineExp = /(^\*)?\n( )?(\t+)? \*( )?/g;

const links = [
	{
		name: 'ImmutableJS',
		lookup: 'ImmutableJS',
		url: 'http://facebook.github.io/immutable-js/'
	},

	{
		name: 'Iterable',
		lookup: 'Immutable.Iterable',
		url: 'http://facebook.github.io/immutable-js/docs/#/Iterable'
	},

	{
		name: 'contrib/cursor',
		lookup: 'contrib/cursor',
		url: 'https://github.com/facebook/immutable-js/tree/master/contrib/cursor'
	},

	{
		name: 'KeyedSeq',
		lookup: 'KeyedSeq',
		url: 'http://facebook.github.io/immutable-js/docs/#/KeyedSeq'
	},
	{
		name: 'IndexedSeq',
		lookup: 'IndexedSeq',
		url: 'http://facebook.github.io/immutable-js/docs/#/IndexedSeq'
	},
	{
		name: 'Seq',
		lookup: 'Immutable.Seq',
		url: 'http://facebook.github.io/immutable-js/docs/#/Seq'
	},
	{
		name: 'Record',
		lookup: 'Immutable.Record',
		url: 'http://facebook.github.io/immutable-js/docs/#/Record'
	},
	{
		name: 'Immutable.fromJS',
		lookup: 'Immutable.fromJS',
		url: 'http://facebook.github.io/immutable-js/docs/#/fromJS'
	},
	{
		name: 'Iterable.isIterable',
		lookup: 'Immutable.Iterable.isIterable',
		url: 'http://facebook.github.io/immutable-js/docs/#/Iterable/isIterable'
	}
];

glob('src/*.js', {}, (er, fileNames) => {
	if (er) {
		console.error(er);
	} else {
		let refs = [],
			parsed = fileNames.map(fileName => {
				let data = fs.readFileSync(fileName, 'utf8'),
					comments = '';
				parse(data, {
					ecmaVersion: 6,
					sourceType: 'module',
					onComment: (block, text) => {
						if (block) {
							let attributes,
								attributeMatch = tagExp.exec(text);
							while(attributeMatch) {
								if (!attributes) {
									attributes = {};
								}
								let parts = attributeMatch[0].split(' ');
								attributes[parts[0].substr(1)] = parts[1];
								attributeMatch = tagExp.exec(text);
							}
							if (attributes) {
								refs.push(attributes);
								text = text.replace(tagExp, '');
							}
							text = text.replace(asteriskAndNewLineExp, '\n');
							comments = comments.concat(
								'- - - \n',
								attributes && attributes.id ? '<a id="' + attributes.id + '"></a>' : '',
								text,
								'\n\n'
							);
							text = text.replace(tagExp, '');
						}
					}
				});
				return {
					comments: comments,
					fileName: fileName
				};
			});

		let linkPatterns = links.reduce((memo, link) => {
				memo[link.lookup] = '[' + link.name + '](' + link.url + ')';
				return memo;
			}, {}),
			refPatterns = refs.reduce((memo, ref) => {
				if (ref.id && ref.lookup) {
					memo[ref.lookup] = '[' + (ref.name || ref.lookup) + '](#' + ref.id + ')';
				}
				return memo;
			}, {});

		let concatenatedComments = parsed.reduce((memo, item) => {
			let comments = item.comments;

			if (comments.length > 0) {

				return memo.concat(
					'- - - \n<sub>[See Source](',
					'https://github.com/lukasbuenger/immutable-cursors/tree/v' + pkg.version + '/' + item.fileName,
					')</sub>\n',
					comments
				);
			} else {
				return memo;
			}
		}, '');

		let template = fs.readFileSync('scripts/README.mustache', 'utf8');
		let rendered = Mustache.render(template, {
				pkg: pkg,
				docs: concatenatedComments
			});

		Object.keys(linkPatterns).forEach(key => {
			rendered = rendered.replace(new RegExp('\>\\b' + key + '\\b', 'g'), linkPatterns[key]);
		});

		Object.keys(refPatterns).forEach(key => {
			rendered = rendered.replace(new RegExp('\>\\b' + key + '\\b', 'g'), refPatterns[key]);
		});

		fs.writeFileSync('DOCS.md', rendered);
	}
});
