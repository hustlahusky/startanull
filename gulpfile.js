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
var argv = require('yargs').argv;
console.log(webpack);
// =====================================
// CONFIG
// =====================================
var config = {
  cssPreprocessor: "Sass",
  preprocessorOptions: {},
  webpack: require("./webpack.config.js")
};

// PATHS
// =====================================
config.source = {};
config.source.root = "src/";
config.source.styles = config.source.root+"styles/";
config.source.scripts = config.source.root+"scripts/";
config.source.mainStyle = config.source.styles+"main.scss";
config.source.mainScript = "main.js";

config.result = {};
config.result.root = "assets/";
config.result.styles = config.result.root+"css/";
config.result.scripts = config.result.root+"js/";
config.result.mainStyle = config.result.styles+"main.css";
config.result.mainScript = config.result.scripts+"main.js";

// Set css preprocessor
var preprocessor;
if (config.cssPreprocessor == "Sass") {
  preprocessor = require('gulp-sass');
} else {
  preprocessor = require('gulp-less');
}

// Update Webpack options
config.webpack.entry.app = path.resolve(__dirname, config.source.scripts) + "/" + config.source.mainScript;
config.webpack.output.path = path.resolve(__dirname, config.result.scripts);
config.webpack.output.filename = "main.js";


// =====================================
// TASKS
// =====================================


// STYLES
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

// Recompile styles on change
gulp.task('watch', function() {
  console.log('Start watching for styles');

  var watcher = gulp.watch(config.source.styles+'**', ['styler']);
  watcher.on('change', function(event) {
    console.log('Stylesheet ' + event.path + ' was ' + event.type + ', recompile...');
  });
});


// SCRIPTS
// =====================================

// webpack js build
gulp.task('webpack', function() {
  var src = config.source.mainScript;
  console.log(config.webpack);
  gulp.src(src)
    //.pipe(sourcemaps.init())
    .pipe(webpack(config.webpack))
    //.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../'+config.source.styles}))
    .pipe(gulp.dest(config.result.scripts));
});

// BATCH TASKS
// =====================================
// Build styles
gulp.task('build-css', ['styler', 'prefixer', 'combing', 'minifying']);
// main task
gulp.task('default', ['build-css']);
