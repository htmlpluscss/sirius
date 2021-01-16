
'use strict';

const gulp             = require('gulp');
const nunjucksRender   = require('gulp-nunjucks-render');
const plumber          = require('gulp-plumber');
const server           = require('browser-sync').create();
const ftp              = require('gulp-ftp');
const replace          = require('gulp-replace');
const filter           = require('gulp-filter');
const del              = require('del');
const newer            = require('gulp-newer');
const debug            = require('gulp-debug');
const touch            = require('gulp-touch');
const w3cjs            = require('gulp-w3cjs');

const config             = require('./config.json');
const site             = 'sirius-russia.ru';
const domain           = 'sirius.wndrbase.com';

config.ftp.remotePath += domain;

gulp.task('html', function() {

	return gulp.src('src/*.html', {since: gulp.lastRun('html')})
		.pipe(plumber())
		.pipe(debug({title: 'html:'}))
		.pipe(nunjucksRender({
			data: {
				url: 'http://' + domain,
				site: site
			},
			path: 'src/'
		}))
		.pipe(w3cjs())
		.pipe(w3cjs.reporter())
		.pipe(gulp.dest('build'))

});

gulp.task('html-touch', function() {
	return gulp.src('src/*.html')
		.pipe(touch());

});

gulp.task('serve', function() {

	server.init({
		server: 'build',
		files: [
			{
				match: ['build/**/*.*'],
				fn: function (event, file) {
					this.reload()
				}
			}
		]
	});

});

gulp.task('clear', function() {

	return del('build');

});

gulp.task('copy', function() {

	return gulp.src(['src/**/*.*', '!src/**/*.html'], {since: gulp.lastRun('copy')})
			.pipe(debug({title: 'copy:'}))
			.pipe(newer('build'))
			.pipe(debug({title: 'copy:newer'}))
			.pipe(gulp.dest('build'))

});

gulp.task('ftp', function () {

	const f = filter('**/*.html', {restore: true});

	return gulp.src('build/**/*.*', {since: gulp.lastRun('ftp')})
		.pipe(debug({title: 'ftp:'}))
		.pipe(f)
		.pipe(replace('.css', '.css?' + Date.now()))
		.pipe(replace('.js', '.js?' + Date.now()))
		.pipe(f.restore)
		.pipe(ftp(config.ftp));

});

gulp.task('watch', function() {
	gulp.watch('src/*.html', gulp.series('html'));
	gulp.watch('src/_include/*.html', gulp.series('html-touch'));
	gulp.watch(['src/**/*.*', '!src/**/*.html'], gulp.series('copy'));
	gulp.watch('build/**/*.*', gulp.series('ftp'));
});

gulp.task('default', gulp.series(
	'clear',
	'html',
	'copy',
	gulp.parallel('ftp','watch','serve')
	));