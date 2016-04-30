"use strict";

require('es6-promise').polyfill();
// =====================================
// DEPENDENCIES
// =====================================
const gulp = require('gulp');
const path = require('path');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const jade = require('gulp-jade');
const conf = require('./.startanull.conf');
const runSequence = require('run-sequence');


// =====================================
// TASKS
// =====================================


// STYLES
// =====================================

// style compile
gulp.task('styler', function() {
  let src = conf.styles.source.file;

  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(conf.styles.preprocessor.instance(conf.styles.preprocessor.options))
    .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '../../'+conf.styles.source.dir}))
    .pipe(gulp.dest(conf.styles.result.dir));
});

// add prefixes
gulp.task('prefixer', function () {
  let src = conf.styles.result.file;

  return gulp.src(src)
    .pipe(autoprefixer({
      browsers: ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24', 'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6'],
      cascade: false
    }))
    .pipe(gulp.dest(conf.styles.result.dir));
});

// ccscomb
gulp.task('combing', function() {
  let src = conf.styles.result.file;

  return gulp.src(src)
    .pipe(csscomb())
    .pipe(gulp.dest(conf.styles.result.dir));
});

// minify css
gulp.task('minifying', function() {
  let src = conf.styles.result.file;

  return gulp.src(src)
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(conf.styles.result.dir));
});

// Build styles
gulp.task('build-css', function () {
  runSequence('styler', 'prefixer', 'combing', 'minifying');
});


// SCRIPTS
// =====================================

// webpack js build
gulp.task('webpack', function() {
  let src = conf.scripts.source.file;

  /*console.log(conf.scripts.source.file);
  console.log(conf.scripts.webpack);
  console.log(conf.scripts.result.dir);*/

  return gulp.src(src)
    .pipe(webpack(conf.scripts.webpack))
    .pipe(gulp.dest(conf.scripts.result.dir));
});

// copy js libs to assets
gulp.task('copy-libs', function() {
  for (let lib in conf.scripts.libs)
    if (conf.scripts.libs.hasOwnProperty(lib))
      conf.funcs.copyLib(lib);
});


// TEMPLATE
// =====================================

// jade
gulp.task('jade', function() {
  let src = conf.templates.source.file;

  return gulp.src(src)
    .pipe(jade({
      locals: conf.templates.source.locals,
      pretty: true
    }))
    .pipe(gulp.dest(conf.templates.result.dir))
});


// WATCHERS
// =====================================

gulp.task('watch', function() {
  console.log('Start watching for styles');

  // Recompile styles on change

  let style_watcher = gulp.watch(conf.source.styles.dir+'**', ['styler']);
  style_watcher.on('change', function(event) {
    console.log('Stylesheet ' + event.path + ' was ' + event.type + ', recompile...');
  });

  // Recompile templates on change

  let template_watcher = gulp.watch(conf.source.templates.dir + "**", ['jade']);
  template_watcher.on('change', function(event) {
    console.log('Template ' + event.path + ' was ' + event.type + ', recompile...');
  });
});


// BATCH TASKS
// =====================================
// main task
gulp.task('default', function () {
  runSequence(['build-css', 'webpack', 'jade', 'copy-libs']);
});
