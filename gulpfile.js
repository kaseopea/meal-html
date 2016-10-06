var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	fileinclude = require('gulp-file-include'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	del = require('del'),
	bourbon = require('node-bourbon'),
	uglify = require('gulp-uglify');

gulp.task('browser-sync', ['styles', 'scripts'], function () {
	browserSync.init({
		server: {
			baseDir: "./dist"
		},
		notify: false,
		reloadDelay: 500
	});
});

gulp.task('styles', function () {
	return gulp.src('app/scss/*.scss')
		.pipe(sass({
			includePaths: require('node-bourbon').includePaths
		}).on('error', sass.logError))
		.pipe(rename({suffix: '.min', prefix: ''}))
		.pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});
gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('scripts', function () {
	return gulp.src([
			'./app/libs/modernizr/modernizr.js',
			'./app/libs/jquery/dist/jquery.js',
			'./app/libs/materialize/dist/js/materialize.js'
		])
		.pipe(concat('libs.js'))
		.pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('buildhtml', function () {
	return gulp.src(['app/**/*.html'])
		.pipe(fileinclude({
			prefix: '@@'
		}))
		.pipe(gulp.dest('dist/'));
		// .pipe(browserSync.reload);
});

gulp.task('watch', function () {
	gulp.watch('app/scss/**/*.scss', ['styles']);
	gulp.watch('app/libs/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html', ['buildhtml', 'browserSync_Reload']);
});
gulp.task('browserSync_Reload', function () {
	browserSync.reload();
});

gulp.task('default', ['browser-sync', 'watch']);


gulp.task('removedist', function () {
	return del.sync('dist');
});
gulp.task('build', ['removedist', 'buildhtml', 'imagemin', 'styles', 'scripts'], function () {
	var buildFiles = gulp.src([
		'app/.htaccess'
	]).pipe(gulp.dest('dist'));

	var buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
	var buildJs = gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));

});