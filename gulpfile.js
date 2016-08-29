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
const jade = require('gulp-jade');
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

// Build CSS from styles
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
gulp.task('scripts.build', (cb) => {
  glob(conf.scriptsSrc, conf.globOptions, (err, files) => {
    if (err) return cb(err);

    async.each(files, (file, cb) => {
      file = path.resolve(file);

      let dest = conf.scriptsDest;
      if (!dest) dest = path.dirname(file);

      gulp.src(file)
        .pipe(webpackStream(conf.scriptsWebpack))
        .pipe(gulp.dest(dest))
        .on('end', cb);
    }, (err) => cb(err));
  });

  /*
  // Minified file
  webpackOptions.output.filename =
    conf.scripts.result.filename.replace('.js', '.min.js');

  // Sourcemap
  webpackOptions.output.sourceMapFilename =
    webpackOptions.output.filename + '.map';

  // Add UglifyJS plugin
  if (_.isEmpty(webpackOptions.plugins))
    webpackOptions.plugins = [];

  webpackOptions.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );*/
});


// TEMPLATE
// -------------------------------------

// jade
gulp.task('templates.build', function() {
  if (!conf.templates)
    return console.error('Templates is disabled');

  let src = conf.templates.source.file;

  return gulp.src(src)
    .pipe(jade(conf.templates.source.options))
    .pipe(gulp.dest(conf.templates.result.dir));
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


// WATCHERS
// -------------------------------------

// gulp watch [options]
//   -s - for styles
//   -j - for scripts
//   -t - for templates
//   if no options passed - all
gulp.task('watch', function() {
  let opts = _.clone(argv);
  delete opts._;
  delete opts.$0;

  // If no options, set all to true
  if (_.isEmpty(opts)) {
    opts.s = Boolean(conf.styles.source);
    opts.j = Boolean(conf.scripts);
    opts.t = Boolean(conf.templates);
  }

  // Rebuild styles on change
  if (opts.s) {
    if (!conf.styles.source)
      return console.error('Styles build from sources is disabled');

    watch(conf.styles.source.dir + path.sep + '**', () => {
      runSequence('styles.build');
    });
  }

  // Rebuild templates on change
  if (opts.t) {
    if (!conf.templates)
      return console.error('Templates is disabled');

    watch(conf.templates.source.dir + path.sep + '**', () => {
      runSequence('templates.build');
    });
  }

  // Webpack watch
  if (opts.j) {
    if (!conf.scripts)
      return console.error('Scripts is disabled');

    let src = conf.scripts.source.file;

    let webpackConfig = _.clone(conf.scripts.webpack);
    webpackConfig.watch = true;

    gulp.src(src)
      .pipe(webpackStream(webpackConfig))
      .pipe(gulp.dest(conf.scripts.result.dir));
  }
});


// BROWSER-SYNC
// -------------------------------------

gulp.task('serve', function() {
  browserSync.init(conf.browserSync.options);

  gulp.watch(conf.browserSync.watch).on('change', browserSync.reload);
});


// BATCH TASKS
// -------------------------------------

// build main
gulp.task('default', function() {
  runSequence([
    'styles.batch',
    'scripts.build',
    'templates.build',
    'scripts.copylibs',
    'images'
  ]);
});


// =====================================
// COMPONENTS
// =====================================

// Styles
// -------------------------------------

gulp.task('component.styles.build', function() {
  if (!conf.components.styles)
    return console.error('Component styles is disabled');

  let style = conf.components.styles.source.file;

  if (argv.component)
    style = style.replace('*', argv.component);

  glob(style, {dot: true}, function(err) {
    if (err) return console.error(err);

    return gulp.src(style)
      .pipe(sourcemaps.init())
      .pipe(conf.styles.preprocessor.instance(conf.styles.preprocessor.options))
      .pipe(rename(function(filepath) {
        if (argv.component)
          filepath.dirname = argv.component;
        else
          filepath.dirname = filepath.dirname.split(path.sep)[0];

        filepath.dirname =
          filepath.dirname + path.sep + conf.components.styles.result.dirname;
      }))
      .pipe(sourcemaps.write('.', conf.styles.sourcemaps))
      .pipe(gulp.dest(conf.components.root));
  });
});

gulp.task('component.styles.dist', function() {
  if (!conf.components.styles)
    return console.error('Component styles is disabled');

  let src = conf.components.styles.result.file;

  if (argv.component)
    src = src.replace('*', argv.component);

  glob(src, {dot: true}, function(err) {
    if (err) return console.error(err);

    return gulp.src(src)
      // add prefixes
      .pipe(autoprefixer(conf.styles.autoprefixer))
      .pipe(rename(function(filepath) {
        if (argv.component)
          filepath.dirname = argv.component;
        else
          filepath.dirname = filepath.dirname.split(path.sep)[0];

        filepath.dirname =
          filepath.dirname + path.sep + conf.components.styles.result.dirname;
      }))
      .pipe(gulp.dest(conf.components.root))
      // minify css
      .pipe(cssnano())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(conf.components.root));
  });
});

gulp.task('component.styles.batch', function() {
  runSequence('component.styles.build', 'component.styles.dist');
});


// Scripts
// -------------------------------------

gulp.task('component.scripts.build', function() {
  if (!conf.components.scripts)
    return console.error('Component scripts is disabled');

  let src = conf.components.scripts.source.file;

  if (argv.component)
    src = src.replace('*', argv.component);

  glob(src, {dot: true}, function(err, files) {
    if (err) return console.error(err);

    let webpackOptions = _.clone(conf.scripts.webpack);
    webpackOptions.output.filename = conf.components.scripts.result.filename;

    if (_.isEmpty(webpackOptions.plugins))
      webpackOptions.plugins = [];

    webpackOptions.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    );

    files.forEach(function(item) {
      item = path.resolve(item);

      let breakpoint = conf.components.source.split('*');
      breakpoint[0] = breakpoint[0].length;
      breakpoint[1] = item.indexOf(breakpoint[1]);

      let component = item.substring(breakpoint[0], breakpoint[1]);

      gulp.src(item)
        .pipe(webpackStream(webpackOptions))
        .pipe(rename(function(filepath) {
          filepath.dirname =
            component + path.sep + conf.components.scripts.result.dirname;
        }))
        .pipe(gulp.dest(conf.components.root));
    });
  });
});

// Template
// -------------------------------------

gulp.task('component.templates.build', function() {
  if (!conf.components.templates)
    return console.error('Component templates is disabled');

  let src = conf.components.templates.source.file;

  if (argv.component)
    src = src.replace('*', argv.component);

  glob(src, {dot: true}, function(err) {
    if (err) return console.error(err);

    return gulp.src(src)
      .pipe(jade(conf.components.templates.source.options))
      .pipe(rename(function(filepath) {
        if (argv.component)
          filepath.dirname = argv.component;
        else
          filepath.dirname = filepath.dirname.split(path.sep)[0];

        filepath.dirname =
          filepath.dirname + path.sep +
          conf.components.templates.result.dirname;
      }))
      .pipe(gulp.dest(conf.components.root));
  });
});

// Component full build
// -------------------------------------

gulp.task('component.build', function() {
  if (!conf.components)
    return console.error('Components is disabled');

  runSequence(['component.styles.batch', 'component.scripts.build']);
});

// WATCHERS
// -------------------------------------

// gulp component.watch [options] [--component]
//   -s - for styles
//   -j - for scripts
//   -t - for templates
//   if no options passed - all
gulp.task('component.watch', function() {
  if (!conf.components)
    return console.error('Components is disabled');

  let opts = {
    s: argv.s,
    j: argv.j,
    t: argv.t
  };

  let component = false;
  if (argv.component) {
    component = argv.component;
    delete opts.component;
  }

  // If no options, set all to true
  if (_.isEmpty(_.without(_.values(opts), undefined))) {
    opts.s = Boolean(conf.components.styles.source);
    opts.j = Boolean(conf.components.scripts);
    opts.t = Boolean(conf.components.templates);
  }

  // Rebuild styles on change
  if (opts.s) {
    if (!conf.components.styles.source)
      return console.error('Styles build from sources is disabled');

    let style = conf.components.styles.source.dir;

    if (component)
      style = style.replace('*', component);

    glob(style, {dot: true}, function(err) {
      if (err) return console.error(err);

      watch(style + path.sep + '**', () => {
        runSequence('component.styles.build');
      });
    });
  }

  // Rebuild templates on change
  if (opts.t) {
    if (!conf.components.templates)
      return console.error('Templates is disabled');

    let template = conf.components.templates.source.dir;

    if (component)
      template = template.replace('*', component);

    glob(template, {dot: true}, function(err) {
      if (err) return console.error(err);

      watch(template + path.sep + '**', () => {
        runSequence('component.templates.build');
      });
    });
  }

  // Webpack watch
  if (opts.j) {
    if (!conf.components.scripts)
      return console.error('Scripts is disabled');

    let src = conf.components.scripts.source.file;

    if (component)
      src = src.replace('*', component);

    glob(src, {dot: true}, function(err, files) {
      if (err) return console.error(err);

      let webpackOptions = _.clone(conf.scripts.webpack);
      webpackOptions.output.filename = conf.components.scripts.result.filename;
      webpackOptions.watch = true;

      files.forEach(function(item) {
        item = path.resolve(item);

        let breakpoint = conf.components.source.split('*');
        breakpoint[0] = breakpoint[0].length;
        breakpoint[1] = item.indexOf(breakpoint[1]);

        let component = item.substring(breakpoint[0], breakpoint[1]);

        gulp.src(item)
          .pipe(webpackStream(webpackOptions))
          .pipe(rename(function(filepath) {
            filepath.dirname =
              component + path.sep + conf.components.scripts.result.dirname;
          }))
          .pipe(gulp.dest(conf.components.root));
      });
    });
  }
});
