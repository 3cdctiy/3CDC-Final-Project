'use strict';

const browserSync   = require('browser-sync').create();
const runSequence   = require('run-sequence');

const gulp          = require('gulp');
const sass          = require('gulp-sass');
const cssimport     = require('gulp-cssimport');
const autoprefixer  = require('gulp-autoprefixer');
const concat        = require('gulp-concat');
const minifyCss     = require('gulp-minify-css');
const streamqueue   = require('streamqueue');

const imagemin      = require('gulp-imagemin');
const cache         = require('gulp-cache');

const child         = require('child_process');
const gutil         = require('gulp-util');
const babel         = require('gulp-babel');

const del           = require('del');

const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');

const siteRoot      = 'server/views/';
const siteDist      = 'server/app/dist/';
const sassFiles     = 'server/app/sass/**/*.scss';
const cssFiles      = 'server/app/css/**/*.?(s)css';
const jsFiles       = 'server/app/js/**/*.js';






// --------------------------------------------------
// Gulp Task Options
// --------------------------------------------------
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};



// --------------------------------------------------
// Gulp Tasks
// --------------------------------------------------
gulp.task('css', () => {
	return gulp.src(sassFiles)
		.pipe(plumber({
			errorHanlder: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(sass(sassOptions))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(minifyCss())
		.pipe(gulp.dest(siteDist + 'css/'))
});



gulp.task('images', () => {
	return gulp.src('./server/app/images/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin({
		interlaced:true
		})))
		.pipe(gulp.dest(siteDist + 'images'))
		.pipe(plumber({
			errorHanlder: notify.onError("Error: <%= error.message %>")
		}))
});



gulp.task('babel', () => {
  return gulp.src(jsFiles)
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest(siteDist + 'js/'))
	.pipe(plumber({
		errorHanlder: notify.onError("Error: <%= error.message %>")
	}))
});



gulp.task('partials', () => {
  gulp.src('server/app/partials/*.html')
    .pipe(gulp.dest(siteDist + 'partials'))
	.pipe(plumber({
		errorHanlder: notify.onError("Error: <%= error.message %>")
	}))
})



// Index needs to stay in views -- so not needed
// gulp.task('views', () => {
//   gulp.src('server/views/*.html')
//     .pipe(gulp.dest('server/app/'))
// 	.pipe(plumber({
// 		errorHanlder: notify.onError("Error: <%= error.message %>")
// 	}))
// })



gulp.task('fonts', () => {
  return gulp.src('server/app/dist/fonts/**/*')
    .pipe(gulp.dest(siteDist + 'fonts'))
	.pipe(plumber({
		errorHanlder: notify.onError("Error: <%= error.message %>")
	}))
});



gulp.task('serve', () => {
  // browserSync.init({
  //   files: ['server/' + '/**'],
  //   port: 3000,
  //   server: {
  //     baseDir: siteRoot
  //   }
  // });

  // gulp.watch('server/views/*.html' ['views'])
  gulp.watch('server/app/partials/**/*.html', ['partials'])
  gulp.watch(sassFiles, ['css'])
  gulp.watch(jsFiles, ['babel']);
});



gulp.task('clean:dist', function() {
  return del.sync('server/app/dist');
});



gulp.task('finished', function() {
	return gulp.src('')
		.pipe(notify("Gulp has completed"))
});



// --------------------------------------------------
// Build Sequences
// --------------------------------------------------
gulp.task('build', ['css', 'images', 'babel', 'partials', 'fonts', 'serve']);



gulp.task('default', function(callback) {
  	runSequence(
	    'clean:dist',
	    ['build'],
			'finished',
	    callback
	)
});
