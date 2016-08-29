'use strict';

require('es6-promise').polyfill();
const gulp = require('gulp');
const path = require('path');
const autoprefixer = require('gulp-autoprefixer');
const _ = require('underscore');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const pug = require('gulp-pug');
const runSequence = require('run-sequence');
const argv = require('yargs').argv;
const glob = require('glob');
const gm = require('gulp-gm');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const conf = require('./startanull-conf.js');

const async = require('async');


/**
 * STYLES
 * =======================================================
 */

/**
 * ```
 * gulp styles.build
 * ```
 * Build CSS from styles
 */
gulp.task('styles.build', (cb) => {
  glob(conf.stylesSrc, conf.globOptions, (err, files) => {
    if (err) return cb(err);

    async.each(files, (file, cb) => {
      file = path.resolve(file);

      let srcDir = path.dirname(file);

      let dest = conf.stylesDest;
      if (!dest) dest = srcDir;

      let mapsOptions = _.defaults(conf.stylesMaps, {
        sourceRoot: path.relative(dest, srcDir)
      });

      gulp.src(file)
        .pipe(sourcemaps.init())
        .pipe(conf.stylesProc(conf.stylesProcOpts))
        .pipe(autoprefixer(conf.stylesAutoprefixer))
        .pipe(sourcemaps.write('.', mapsOptions))
        .pipe(gulp.dest(dest))
        .on('end', cb);
    }, (err) => cb(err));
  });
});


// Minify CSS
gulp.task('styles.min', (cb) => {
  glob(conf.stylesSrc, conf.globOptions, (err, files) => {
    if (err) return cb(err);

    async.each(files, (file, cb) => {
      file = path.resolve(file);

      let dest = conf.stylesDest;
      if (!dest) dest = path.dirname(file);

      let ext = path.extname(file);
      file = dest + path.sep + path.basename(file, ext) + '.css';

      gulp.src(file)
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dest))
        .on('end', cb);
    }, (err) => cb(err));
  });
});


// Build styles
gulp.task('styles', () => runSequence('styles.build', 'styles.min'));


/**
 * SCRIPTS
 * =======================================================
 */

// Webpack js build
let webpackBuilder = (opts, cb) => {
  if (typeof opts === 'function') {
    cb = opts;
    opts = argv;
  }

  if (!cb) cb = () => {};

  console.log(opts);

  glob(conf.scriptsSrc, conf.globOptions, (err, files) => {
    if (err) return cb(err);

    async.each(files, (file, cb) => {
      file = path.resolve(file);

      let dest = conf.scriptsDest;
      if (!dest) dest = path.dirname(file);

      let webpackConfig = _.clone(conf.scriptsWebpack);

      // Watching
      if (opts.watch) webpackConfig.watch = true;

      // Minifying
      if (opts.min) {
        webpackConfig.output.filename =
          webpackConfig.output.filename.replace('.js', '.min.js');

        if (_.isEmpty(webpackConfig.plugins))
          webpackConfig.plugins = [];

        webpackConfig.plugins.push(
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })
        );
      }

      gulp.src(file)
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest(dest))
        .on('end', cb);
    }, (err) => cb(err));
  });
};

gulp.task('scripts.build', (cb) => webpackBuilder(cb));


/**
 * TEMPLATES
 * =======================================================
 */

// Build HTML from Pug
gulp.task('templates.build', (cb) => {
  gulp.src(conf.templatesSrc)
    .pipe(pug(conf.templatesPugOpts))
    .pipe(gulp.dest(conf.templatesDest))
    .on('end', cb);
});


// IMAGES
// -------------------------------------

// gulp images [--rules=(rules separated with commas)]
gulp.task('images', function() {
  if (!conf.img)
    return console.error('Image processing is disabled');

  let rules = conf.img.rules;
  if (argv.rules)
    rules = _.pick(rules, argv.rules.split(','));

  _.each(rules, function(rule) {
    gulp.src(conf.img.source + path.sep + rule.glob)
      .pipe(
        gm(
          function(gmfile, done) {
            return rule.proc(gmfile, done);
          },
          conf.img.opts
        )
      )
      .pipe(gulp.dest(rule.dest));
  });
});


/**
 * WATCHERS
 * =======================================================
 */

// gulp watch [-s|j|t]
//   -s - for styles
//   -j - for scripts
//   -t - for templates
//   if no options passed - all
gulp.task('watch', () => {
  let opts = _.omit(argv, '_', '$0');

  // If no options, set all to true
  if (_.isEmpty(opts)) {
    opts.s = true;
    opts.j = true;
    opts.t = true;
  }

  // Rebuild styles on change
  if (opts.s) {
    if (!conf.stylesWatch) conf.stylesWatch = conf.stylesSrc;
    watch(conf.stylesWatch, () => runSequence('styles.build'));
  }

  // Rebuild templates on change
  if (opts.t) {
    if (!conf.templatesWatch) conf.templatesWatch = conf.templatesSrc;
    watch(conf.templatesWatch, () => runSequence('templates.build'));
  }

  // Webpack watch
  if (opts.j) webpackBuilder({watch: true});
});


// Serve files with browsersync
gulp.task('serve', () => {
  browserSync.init(conf.browserSync.options);

  gulp.watch(conf.browserSync.watch).on('change', browserSync.reload);
});


// BATCH TASKS
// -------------------------------------

// build main
gulp.task('default', [
  'styles.batch',
  'scripts.build',
  'templates.build',
  'images'
]);
