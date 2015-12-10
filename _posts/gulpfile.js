/**
 * Gulp 依赖
 */
//var $ = require('gulp-load-plugins')();
var autoprefixer = require('gulp-autoprefixer');
var babel        = require('gulp-babel');
var browserify   = require('gulp-browserify');
var browser_sync = require('browser-sync').create();
var del          = require('del');
var gulp         = require('gulp');
var jade         = require('gulp-jade');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');

/**
 * 路径
 */
var BABEL_IN         = 'jsx/*.jsx';
var BABEL_OUT        = 'dev/js';

var BROWSERIFY_IN    = 'dev/js/[^_]*.js';
var BROWSERIFY_OUT   = 'dist/static/coin/js';

var IMG_IN           = 'img/*';
var IMG_OUT          = 'dist/static/coin/img';

var JADE_IN          = 'jade/[^_]*.jade';
var JADE_OUT         = 'dist/templates/coin';

var SCSS_IN          = 'scss/app.scss';
var SCSS_OUT         = 'dist/static/coin/css';

var BROWSERIFY_WATCH = 'jsx/*.jsx';
var IMG_WATCH        = 'img/*';
var JADE_WATCH       = 'jade/*.jade';
var SCSS_WATCH       = 'scss/*.scss';

var BROWSER_SYNC_FILES = [
	'dist/static/**',
	'dist/templates/coin/**'
];

var CLEAN_FILES = [
	'dev/**',
	'dist/static/coin/**',
	'dist/templates/coin/**'
];

/**
 * 浏览器同步刷新
 */
gulp.task('browser-sync', function() {
	browser_sync.init({
		proxy: 'localhost:9999',
		files: BROWSER_SYNC_FILES
	});
});

/**
 * Jade 预编译
 */
gulp.task('jade', function() {
	return gulp.src(JADE_IN)
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest(JADE_OUT));
});

/**
 * Scss 预编译
 */
gulp.task('scss', function() {
	return gulp.src(SCSS_IN)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'extend'}))
		.pipe(autoprefixer([
			'ie_mob >= 10',
			'ios >= 6.1',
			'android >= 2.3'
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(SCSS_OUT));
});

/**
 * Browserify 预编译
 */
gulp.task('browserify', ['babel'], function() {
	return gulp.src(BROWSERIFY_IN)
		.pipe(sourcemaps.init())
		.pipe(browserify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(BROWSERIFY_OUT));

		//.pipe(rename({suffix: '.min'}))
		//.pipe(uglify())
});

/**
 * Babel 预编译
 */
gulp.task('babel', function() {
	return gulp.src(BABEL_IN)
		.pipe(babel({
			presets: ['es2015'],
			plugins: [
				'transform-runtime',
				'transform-async-to-generator',
				'transform-es2015-modules-commonjs'
			]
		}))
		.pipe(gulp.dest(BABEL_OUT));
});

/**
 * 图片压缩
 */
gulp.task('imagemin', function() {
	return gulp.src(IMG_IN)
		//.pipe(imagemin({
		//	optimizationLevel: 3, // between 0 - 7
		//	progressive: true,
		//	interlaced: true
		//}))
		.pipe(gulp.dest(IMG_OUT));
});

/**
 * 项目清理
 */
gulp.task('clean', function() {
	return del(CLEAN_FILES);
});

/**
 * 代码检查
 */
// 老子代码写这么屌, 从来不检查 (#‵′)凸

/**
 * 默认 task
*/
gulp.task('default', function () {
	console.log('now my watch begins...');
	gulp.watch(BROWSERIFY_WATCH, ['browserify']);
	gulp.watch(JADE_WATCH, ['jade']);
	gulp.watch(SCSS_WATCH, ['scss']);
	gulp.watch(IMG_WATCH, ['imagemin']);
});
