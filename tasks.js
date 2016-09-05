'use strict';
const _ = require('underscore');
const async = require('async');
const path = require('path');
const glob = require('glob');
const File = require('vinyl');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const gm = require('gulp-gm');
const watch = require('gulp-watch');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const argv = require('yargs').argv;
const browserSync = require('browser-sync').create();

module.exports = (conf) => {
  const gulp = conf.gulp;
  const runSequence = require('run-sequence').use(gulp);

  let defaultDest = (file) => path.dirname(file.path);

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
    if (conf.disableStyles) return console.log('Styles module disabled');

    let dest = conf.stylesDest;
    if (!dest) dest = defaultDest;

    let mapsOptions = _.defaults(conf.stylesMaps, {
      sourceRoot: (file) => {
        if (typeof dest === 'function') dest = dest(file);
        return path.relative(dest, path.dirname(file.path));
      }
    });

    gulp.src(conf.stylesSrc, conf.globOptions)
      .pipe(sourcemaps.init())
      .pipe(conf.stylesProc(conf.stylesProcOpts))
      .pipe(autoprefixer(conf.stylesAutoprefixer))
      .pipe(sourcemaps.write('.', mapsOptions))
      .pipe(gulp.dest(dest))
      .on('end', cb);
  });


  /**
   * Minify CSS
   *
   * ```
   * gulp styles.min
   * ```
   */
  gulp.task('styles.min', (cb) => {
    if (conf.disableStyles) return console.log('Styles module disabled');

    glob(conf.stylesSrc, conf.globOptions, (err, files) => {
      if (err) return cb(err);

      async.each(files, (file, cb) => {
        file = new File({path: file});

        let dest = conf.stylesDest;
        if (!dest) dest = defaultDest;

        let ext = path.extname(file.path);
        let dir = (typeof dest === 'function' ? dest(file) : dest);
        file = dir + path.sep + path.basename(file.path, ext) + '.css';

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
    if (conf.disableScripts) return console.log('Scripts module disabled');

    if (typeof opts === 'function') {
      cb = opts;
      opts = argv;
    }

    if (!cb) cb = () => {};

    let dest = conf.scriptsDest;
    if (!dest) dest = defaultDest;

    let wpConf = _.clone(conf.scriptsWebpack);

    // Watching
    if (opts.watch) wpConf.watch = true;

    // Minifying
    if (opts.min) {
      wpConf.output.filename = wpConf.output.filename.replace('.js', '.min.js');

      if (_.isEmpty(wpConf.plugins))
        wpConf.plugins = [];

      wpConf.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
      );
    }

    gulp.src(conf.scriptsSrc, conf.globOptions)
      .pipe(webpackStream(wpConf))
      .pipe(gulp.dest(dest))
      .on('end', cb);
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
    if (conf.disableTemplates) return console.log('Templates module disabled');

    let dest = conf.templatesDest;
    if (!dest) dest = defaultDest;

    gulp.src(conf.templatesSrc, conf.globOptions)
      .pipe(pug(conf.templatesPugOpts))
      .pipe(gulp.dest(dest))
      .on('end', cb);
  });


  // IMAGES
  // -------------------------------------

  // gulp images [--rules=(rules separated with commas)]
  /*
  gulp.task('images', function() {
    if (conf.disableImages) return console.log('Images module disabled');

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
  */


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
      opts.s = !conf.disableStyles;
      opts.j = !conf.disableScripts;
      opts.t = !conf.disableTemplates;
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
    browserSync.init(conf.browserSyncOpts);
    gulp.watch(conf.browserSyncWatch).on('change', browserSync.reload);
  });
};
