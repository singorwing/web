import gulp from 'gulp';
import browserSync from 'browser-sync';
import proxy from 'proxy-middleware';
import historyApiFallback from 'connect-history-api-fallback/lib';
import project from '../aurelia.json';
import build from './build';
import {CLIOptions} from 'aurelia-cli';

function log(message) {
	console.log(message); //eslint-disable-line no-console
}

function onChange(path) {
	log(`File Changed: ${path}`);
}

function reload(done) {
	browserSync.reload();
	done();
}

let serve = gulp.series(
	build,
	done => {
		browserSync({
			online: false,
			open: false,
			port: 9000,
			logLevel: 'silent',
			cors: true,
			server: {
				baseDir: ['.'],
				middleware: [
					proxy({ hostname: 'localhost', port: 8000, pathname: '/api', route: '/api' }),
					historyApiFallback(),
					function(req, res, next) {
						res.setHeader('Access-Control-Allow-Origin', '*');
						next();
					}
				]
			}
		}, function(err, bs) {
			if (err) return done(err);
			let urls = bs.options.get('urls').toJS();
			log(`Application Available At: ${urls.local}`);
			log(`BrowserSync Available At: ${urls.ui}`);
			done();
		});
	}
);

let refresh = gulp.series(
	build,
	reload
);

let watch = function() {
	gulp.watch(project.transpiler.source, refresh).on('change', onChange);
	gulp.watch(project.markupProcessor.source, refresh).on('change', onChange);
	gulp.watch(project.cssProcessor.source, refresh).on('change', onChange);
};

let run;

if (CLIOptions.hasFlag('watch')) {
	run = gulp.series(
		serve,
		watch
	);
} else {
	run = serve;
}

export { run as default, watch };
