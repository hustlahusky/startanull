'use strict';
const _ = require('underscore');
const async = require('async');
const path = require('path');
const glob = require('glob');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const gm = require('gulp-gm');
const watch = require('gulp-watch');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const runSequence = require('run-sequence');
const argv = require('yargs').argv;
const browserSync = require('browser-sync').create();
const conf = require('./startanull-conf.js');


// Disable modules if no config for them
let disableStyles = true;
let disableScripts = true;
let disableTemplates = true;
let disableImages = true;
let confKeys = _.keys(conf);
_.each(confKeys, (key) => {
  if (key.search('styles') >= 0) disableStyles = false;
  if (key.search('scripts') >= 0) disableScripts = false;
  if (key.search('templates') >= 0) disableTemplates = false;
  if (key.search('img') >= 0) disableImages = false;
});


/**
 * Default
 * -------------------------------------------------------
 *
 * Build styles, scripts and templates
 *
 * ```
 * gulp
 * ```
 */
gulp.task('default', [
  'styles',
  'scripts.build',
  'templates.build'
  // 'images'
]);


/**
 * Styles
 * -------------------------------------------------------
 *
 * Build CSS from styles
 *
 * ```
 * gulp styles.build
 * ```
 */
gulp.task('styles.build', (cb) => {
  if (disableStyles) return console.log('Styles module disabled');
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


/**
 * Minify CSS
 *
 * ```
 * gulp styles.min
 * ```
 */
gulp.task('styles.min', (cb) => {
  if (disableStyles) return console.log('Styles module disabled');
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


/**
 * Build CSS from styles and minify them
 *
 * ```
 * gulp styles
 * ```
 */
gulp.task('styles', () => runSequence('styles.build', 'styles.min'));


// Webpack js build
let webpackBuilder = (opts, cb) => {
  if (disableScripts) return console.log('Scripts module disabled');

  if (typeof opts === 'function') {
    cb = opts;
    opts = argv;
  }

  if (!cb) cb = () => {};

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

/**
 * Scripts
 * -------------------------------------------------------
 *
 * Build Scripts with Webpack. Pass `min` flag for minified version
 *
 * ```
 * gulp scripts.build [--min]
 * ```
 */
gulp.task('scripts.build', (cb) => webpackBuilder(cb));


/**
 * Templates
 * -------------------------------------------------------
 *
 * Build HTML from Pug templates
 *
 * ```
 * gulp templates.build
 * ```
 */
gulp.task('templates.build', (cb) => {
  if (disableTemplates) return console.log('Templates module disabled');
  gulp.src(conf.templatesSrc)
    .pipe(pug(conf.templatesPugOpts))
    .pipe(gulp.dest(conf.templatesDest))
    .on('end', cb);
});


// IMAGES
// -------------------------------------

// gulp images [--rules=(rules separated with commas)]
gulp.task('images', function() {
  if (disableImages) return console.log('Images module disabled');

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
 * Watchers
 * -------------------------------------------------------
 *
 * Rebuild assets on sources changed. Pass some options if you want watch for
 * specific modules.
 *
 * - `s` - for styles
 * - `j` - for scripts
 * - `t` - for templates
 *
 * ```
 * gulp watch [-s|j|t]
 * ```
 */
gulp.task('watch', () => {
  let opts = _.omit(argv, '_', '$0');

  // If no options, set all by default activated modules
  if (_.isEmpty(opts)) {
    opts.s = disableStyles;
    opts.j = disableScripts;
    opts.t = disableTemplates;
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


/**
 * BrowserSync
 * -------------------------------------------------------
 *
 * Serve files with BrowserSync
 *
 * ```
 * gulp serve
 * ```
 */
gulp.task('serve', () => {
  browserSync.init(conf.browserSync.options);

  gulp.watch(conf.browserSync.watch).on('change', browserSync.reload);
});
