import path from 'path';
import Jasmine from 'jasmine';
import SpecReporter from 'jasmine-spec-reporter';


let specGlob = process.argv[2];
let noop = function () {},
	jrunner = new Jasmine();

jrunner.configureDefaultReporter({print: noop});
jasmine.getEnv().addReporter(new SpecReporter({
	displayStacktrace: 'specs',
	displayFailuresSummary: true,
	displaySuccessfulSpec: true,
	displayFailedSpec: true,
	displayPendingSpec: true,
	displaySpecDuration: true,
	displaySuiteNumber: false,
	colors: {
		success: 'green',
		failure: 'red',
		skipped: 'cyan'
	},
	prefixes: {
		success: '✓ ',
		failure: '✗ ',
		pending: '- '
	},
	customProcessors: []
}));

jrunner.projectBaseDir = '';
jrunner.specDir = '';
jrunner.addSpecFiles([
	path.resolve(specGlob || 'tests/*Spec.js')
]);
jrunner.execute();
