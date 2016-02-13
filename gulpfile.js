require('es6-promise').polyfill();
// =====================================
// DEPENDENCIES
// =====================================
var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var argv = require('yargs').argv;

// =====================================
// PATHS
// =====================================
var source = {
  root: "src/",
  styles: this.root+"styles/",
  scripts: this.root+"scripts/",
  mainStyle: this.styles+"main.scss"
};

var result = {
  root: "assets/",
  styles: this.root+"css/",
  scripts: this.root+"js/",
  mainStyle: this.styles+"main.css"
};

// =====================================
// TASKS
// =====================================
// style compile
gulp.task('styler', function() {
  var src = source.mainStyle;

  gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../'+source.styles}))
    .pipe(gulp.dest(result.styles));
});

// add prefixes
gulp.task('prefixer', function () {
  var src = result.mainStyle;

  gulp.src(src)
    .pipe(autoprefixer({
      browsers: ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24', 'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6'],
      cascade: false
    }))
    .pipe(gulp.dest(result.styles));
});

// ccscomb
gulp.task('combing', function() {
  var src = result.mainStyle;

  gulp.src(src)
    .pipe(csscomb())
    .pipe(gulp.dest(result.styles));
});

// minify css
gulp.task('minifying', function() {
  var src = result.mainStyle;

  gulp.src(src)
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(result.styles));
});

// Build styles
gulp.task('build-css', ['styler', 'prefixer', 'combing', 'minifying']);

// Recompile styles on change
gulp.task('watch', function() {
  console.log('Start watching for styles');

  var watcher = gulp.watch(source.styles+'**', ['styler']);
  watcher.on('change', function(event) {
    console.log('Stylesheet ' + event.path + ' was ' + event.type + ', recompile...');
  });
});

// main task
gulp.task('default', ['build-css']);
