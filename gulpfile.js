// =====================================
// CONFIG
// =====================================
var config = {
  cssPreprocessor: "Sass",
  preprocessorOptions: {}
};

// PATHS
// =====================================
config.source = {};
config.source.root = "src/";
config.source.styles = config.source.root+"styles/";
config.source.scripts = config.source.root+"scripts/";
config.source.mainStyle = config.source.styles+"main.scss";

config.result = {};
config.result.root = "assets/";
config.result.styles = config.result.root+"css/";
config.result.scripts = config.result.root+"js/";
config.result.mainStyle = config.result.styles+"main.css";

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
var argv = require('yargs').argv;

var preprocessor;
if (config.cssPreprocessor == "Sass") {
  preprocessor = require('gulp-sass');
} else {
  preprocessor = require('gulp-less');
}

// =====================================
// TASKS
// =====================================
// style compile
gulp.task('styler', function() {
  var src = config.source.mainStyle;

  gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(preprocessor(config.preprocessorOptions))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../'+config.source.styles}))
    .pipe(gulp.dest(config.result.styles));
});

// add prefixes
gulp.task('prefixer', function () {
  var src = config.result.mainStyle;

  gulp.src(src)
    .pipe(autoprefixer({
      browsers: ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24', 'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6'],
      cascade: false
    }))
    .pipe(gulp.dest(config.result.styles));
});

// ccscomb
gulp.task('combing', function() {
  var src = config.result.mainStyle;

  gulp.src(src)
    .pipe(csscomb())
    .pipe(gulp.dest(config.result.styles));
});

// minify css
gulp.task('minifying', function() {
  var src = config.result.mainStyle;

  gulp.src(src)
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.result.styles));
});

// Build styles
gulp.task('build-css', ['styler', 'prefixer', 'combing', 'minifying']);

// Recompile styles on change
gulp.task('watch', function() {
  console.log('Start watching for styles');

  var watcher = gulp.watch(config.source.styles+'**', ['styler']);
  watcher.on('change', function(event) {
    console.log('Stylesheet ' + event.path + ' was ' + event.type + ', recompile...');
  });
});

// main task
gulp.task('default', ['build-css']);
