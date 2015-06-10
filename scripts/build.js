import browserify from 'browserify';
import browserifyShim from 'browserify-shim';
import babelify from 'babelify';
import uglifyify from 'uglifyify';
import fs from 'fs';
import pkg from '../package.json';


let env = process.argv[2],
	isProduction = env === 'prod',
	bundler = browserify({
		debug: !isProduction,
		standalone: 'ImmutableTree'
	}),
	destination = process.cwd().concat('/dist/',
		pkg.name,
		isProduction ? '.min': '',
		'.js'
	);

bundler.transform(babelify);
bundler.transform(browserifyShim, pkg['browserify-shim']);

if (isProduction) {
	bundler.transform({ global: true, mangle: true, compress: true }, uglifyify);
}
bundler.require(process.cwd()+'/src/index.js', {entry: true});
bundler.bundle().on('error', (error) => {
		console.log('Error: '+ error);
	})
	.pipe(fs.createWriteStream(destination));
