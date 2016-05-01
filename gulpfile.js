"use strict";

require('es6-promise').polyfill();
// =====================================
// DEPENDENCIES
// =====================================
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const jade = require('gulp-jade');
const runSequence = require('run-sequence');
const argv = require('yargs').argv;
const glob = require('glob');
const conf = require('./.startanull.conf');


// =====================================
// MAIN
// =====================================


// STYLES
// -------------------------------------

// style build
gulp.task('styles.build', function() {
  if (!Boolean(conf.styles.source))
    return console.error("Styles build from sources is disabled");

  let src = conf.styles.source.file;

  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(conf.styles.preprocessor.instance(conf.styles.preprocessor.options))
    .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '../../'+conf.styles.source.dir}))
    .pipe(gulp.dest(conf.styles.result.dir));
});

// style to dist
gulp.task('styles.dist', function () {
  if (!Boolean(conf.styles.result))
    return console.error("Styles is disabled");

  let src = conf.styles.result.file;

  return gulp.src(src)
    // add prefixes
    .pipe(autoprefixer(conf.styles.autoprefixer))
    // ccscomb
    .pipe(csscomb())
    .pipe(gulp.dest(conf.styles.result.dir))
    // minify css
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(conf.styles.result.dir));
});

// Build styles
gulp.task('styles.batch', function () {
  if (!Boolean(conf.styles))
    return console.error("Styles is disabled");

  runSequence('styles.build', 'styles.dist');
});


// SCRIPTS
// -------------------------------------

// webpack js build
gulp.task('scripts.build', function() {
  if (!Boolean(conf.scripts))
    return console.error("Scripts is disabled");

  let src = conf.scripts.source.file;

  return gulp.src(src)
    .pipe(webpack(conf.scripts.webpack))
    .pipe(gulp.dest(conf.scripts.result.dir));
});

// copy js libs to assets
gulp.task('scripts.copylibs', function() {
  if (!Boolean(conf.scripts))
    return console.error("Scripts is disabled");

  for (let lib in conf.scripts.libs)
    if (conf.scripts.libs.hasOwnProperty(lib))
      conf.funcs.copyLib(lib);
});


// TEMPLATE
// -------------------------------------

// jade
gulp.task('templates.build', function() {
  if (!Boolean(conf.templates))
    return console.error("Templates is disabled");

  let src = conf.templates.source.file;

  return gulp.src(src)
    .pipe(jade({
      locals: conf.templates.source.locals,
      pretty: true
    }))
    .pipe(gulp.dest(conf.templates.result.dir))
});


// WATCHERS
// -------------------------------------

gulp.task('watch', function() {
  console.log('Start watching for styles');

  // Rebuild styles on change

  let style_watcher = gulp.watch(conf.source.styles.dir+'**', ['styler']);
  style_watcher.on('change', function(event) {
    console.log('Stylesheet ' + event.path + ' was ' + event.type + ', rebuild...');
  });

  // Rebuild templates on change

  let template_watcher = gulp.watch(conf.source.templates.dir + "**", ['jade']);
  template_watcher.on('change', function(event) {
    console.log('Template ' + event.path + ' was ' + event.type + ', rebuild...');
  });
});


// BATCH TASKS
// -------------------------------------

// build main
gulp.task('default', function () {
  runSequence(['styles.batch', 'scripts.build', 'templates.build', 'scripts.copylibs']);
});



// =====================================
// COMPONENTS
// =====================================

// Styles
// -------------------------------------

gulp.task('component.styles.build', function() {
  if (!Boolean(conf.components.styles))
    return console.error("Component styles is disabled");

  let style = conf.components.styles.source.file;

  if (argv.component) {
    style = style.replace("*", argv.component);

    try {
      let stats = fs.statSync(style);
    } catch (err) {
      return console.error(err);
    }
  }

  return gulp.src(style)
    .pipe(sourcemaps.init())
    .pipe(conf.styles.preprocessor.instance(conf.styles.preprocessor.options))
    .pipe(rename(function(filepath) {
      if (argv.component)
        filepath.dirname = argv.component;
      else
        filepath.dirname = filepath.dirname.split(path.sep)[0];

      filepath.dirname = filepath.dirname + path.sep + conf.components.styles.result.dirname;
    }))
    .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '../../'+conf.styles.source.dir}))
    .pipe(gulp.dest(conf.components.root))
});

gulp.task('component.styles.dist', function () {
  if (!Boolean(conf.components.styles))
    return console.error("Component styles is disabled");
  
  let src = conf.components.styles.result.file;

  if (argv.component) {
    src = src.replace("*", argv.component);

    try {
      let stats = fs.statSync(src);
    } catch (err) {
      return console.error(err);
    }
  }

  return gulp.src(src)
    // add prefixes
    .pipe(autoprefixer(conf.styles.autoprefixer))
    // ccscomb
    .pipe(csscomb())
    .pipe(rename(function(filepath) {
      if (argv.component)
        filepath.dirname = argv.component;
      else
        filepath.dirname = filepath.dirname.split(path.sep)[0];

      filepath.dirname = filepath.dirname + path.sep + conf.components.styles.result.dirname;
    }))
    .pipe(gulp.dest(conf.components.root))
    // minify css
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(conf.components.root));
});

gulp.task('component.styles.batch', function () {
  runSequence('component.styles.build', 'component.styles.dist');
});


// Scripts
// -------------------------------------

gulp.task('component.scripts.build', function() {
  if (!Boolean(conf.components.scripts))
    return console.error("Component scripts is disabled");
  
  let src = conf.components.scripts.source.file;

  if (argv.component) {
    src = src.replace("*", argv.component);

    try {
      let stats = fs.statSync(src);
    } catch (err) {
      return console.error(err);
    }
  }

  let webpackOptions = JSON.parse(JSON.stringify(conf.scripts.webpack));
  webpackOptions.output.filename = conf.components.scripts.result.filename;

  try {
    let files = glob.sync(src);

    files.forEach(function (item) {
      item = path.resolve(item);

      let breakpoint = conf.components.source.split("*");
      breakpoint[0] = breakpoint[0].length;
      breakpoint[1] = item.indexOf(breakpoint[1]);

      let component = item.substring(breakpoint[0], breakpoint[1]);

      gulp.src(item)
        .pipe(webpack(webpackOptions))
        .pipe(rename(function(filepath) {
          filepath.dirname = component + path.sep + conf.components.scripts.result.dirname;
        }))
        .pipe(gulp.dest(conf.components.root));
    });
  } catch (err) {
    return console.error(err);
  }
});

// Template
// -------------------------------------

gulp.task('component.templates.build', function() {
  if (!Boolean(conf.components.templates))
    return console.error("Component templates is disabled");

  let src = conf.components.templates.source.file;

  if (argv.component) {
    src = src.replace("*", argv.component);

    try {
      let files = glob.sync(src);
    } catch (err) {
      return console.error(err);
    }
  }

  return gulp.src(src)
    .pipe(jade({
      pretty: true
    }))
    .pipe(rename(function(filepath) {
      if (argv.component)
        filepath.dirname = argv.component;
      else
        filepath.dirname = filepath.dirname.split(path.sep)[0];

      filepath.dirname = filepath.dirname + path.sep + conf.components.templates.result.dirname;
    }))
    .pipe(gulp.dest(conf.components.root))
});

// Component full build
// -------------------------------------

gulp.task('component.build', function () {
  if (!Boolean(conf.components))
    return console.error("Components is disabled");
  
  runSequence(['component.styles.batch', 'component.scripts.build']);
});
