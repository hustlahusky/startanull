require('es6-promise').polyfill();
// =====================================
// DEPENDENCIES
// =====================================
var gulp = require('gulp');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack-stream');
var jade = require('gulp-jade');
var conf = require('./.startanull.conf');

// Set css preprocessor
var preprocessor;

switch (conf.cssPreprocessor) {
  case "scss":
    preprocessor = require('gulp-sass');
  break;

  default:
    preprocessor = require('gulp-less');
  break;
}


// =====================================
// TASKS
// =====================================


// STYLES
// =====================================

// style compile
gulp.task('styler', function() {
  var src = conf.source.mainStyle;

  gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(preprocessor(conf.preprocessorOptions))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../'+conf.source.styles}))
    .pipe(gulp.dest(conf.result.styles));
});

// add prefixes
gulp.task('prefixer', function () {
  var src = conf.result.mainStyle;

  gulp.src(src)
    .pipe(autoprefixer({
      browsers: ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24', 'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6'],
      cascade: false
    }))
    .pipe(gulp.dest(conf.result.styles));
});

// ccscomb
gulp.task('combing', function() {
  var src = conf.result.mainStyle;

  gulp.src(src)
    .pipe(csscomb())
    .pipe(gulp.dest(conf.result.styles));
});

// minify css
gulp.task('minifying', function() {
  var src = conf.result.mainStyle;

  gulp.src(src)
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(conf.result.styles));
});

// Recompile styles on change
gulp.task('watch', function() {
  console.log('Start watching for styles');

  var watcher = gulp.watch(conf.source.styles+'**', ['styler']);
  watcher.on('change', function(event) {
    console.log('Stylesheet ' + event.path + ' was ' + event.type + ', recompile...');
  });
});


// SCRIPTS
// =====================================

// webpack js build
gulp.task('webpack', function() {
  var src = conf.source.mainScript;

  gulp.src(src)
    .pipe(webpack(conf.webpack))
    .pipe(gulp.dest(conf.result.scripts));
});


// TEMPLATE
// =====================================

// jade
gulp.task('jade', function() {
  var YOUR_LOCALS = {};

  gulp.src(conf.source.templates)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(conf.result.templates))
});

// BATCH TASKS
// =====================================
// Build styles
gulp.task('build-css', ['styler', 'prefixer', 'combing', 'minifying']);
// main task
gulp.task('default', ['build-css', 'webpack', 'jade']);
