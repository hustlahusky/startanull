'use strict';

// const _ = require('underscore');
// const confConstructor = require('./startanull-default-conf');
const path = require('path');

let srcDir = path.resolve(__dirname, 'src');
let resDir = path.resolve(__dirname, 'assets');

let conf = {};

conf.globOptions = {dot: true};

// BrowserSync
conf.browserSync = {
  options: {
    server: resDir
  },

  watch: [
    resDir + path.sep + '**',
    '!' + srcDir + path.sep + '**'
  ]
};

// Styles
conf.stylesProc = require('gulp-less');
conf.stylesProcOpts = {};

conf.stylesSrc = path.resolve(srcDir, 'styles') + path.sep + 'style.less';
conf.stylesDest = path.resolve(resDir, 'css');
conf.stylesWatch = path.resolve(srcDir, 'styles') +
  `${path.sep}**${path.sep}*.less`;

conf.stylesAutoprefixer = {
  browsers: ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24',
    'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 7'],
  cascade: false
};
conf.stylesMaps = {
  includeContent: true
};

// Scripts
conf.scriptsSrc = path.resolve(srcDir, 'scripts') + path.sep + 'main.js';
conf.scriptsDest = path.resolve(resDir, 'js');

conf.scriptsWebpack = {};
conf.scriptsWebpack.output = {
  filename: '[name].js'
};
conf.scriptsWebpack.devtool = 'source-map';
conf.scriptsWebpack.module = {
  loaders: [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }
  ]
};

// Templates
conf.templatesSrc = path.resolve(srcDir, 'pug') + path.sep + '*.pug';
conf.templatesDest = resDir;
conf.templatesWatch = '';
conf.templatesPugOpts = {
  locals: {},
  pretty: true
};

/**
 * CUSTOM INJECTION
 *
 * Rewrite any options you want in this file
 */
// let conf = confConstructor();
// Disable something
// conf.styles = false; // disable styles

// Change Less to Sass
// npm i --save-dev gulp-sass
// conf.styles.preprocessor.instance = require('gulp-sass');
// conf.styles.source.filename = 'style.scss';
// conf.styles.source.file = conf.styles.source.dir + path.sep + conf.styles.source.filename;

// Add JS libraries
// conf.scripts.libs = _.extend(conf.scripts.libs, {
//   jquery: path.resolve(conf.bower.directory, 'jquery/dist') + path.sep + '**',
//   test: [
//     path.resolve(conf.bower.directory, 'jquery/dist') + path.sep + 'jquery.js',
//     path.resolve(conf.bower.directory, 'jquery/dist') + path.sep + 'jquery.slim.js'
//   ]
// });

// Webpack
// conf.scripts.webpack.externals = {
//   jquery: '$'
// };
//
// conf.scripts.webpack.devtool = 'eval';

// Add image processing rules

// See more methods at: http://aheckmann.github.io/gm/docs.html
// conf.img.rules.slider = {
//   glob: 'slider/**',
//   dest: path.resolve(conf.img.result, 'slider'),
//   proc: function(file, done) {
//     done(
//       null,
//       file
//         .resize(1200)
//         .quality(85)
//         .noProfile()
//     );
//   }
// };

// Change BrowserSync options
// conf.browserSync.options = {
//   proxy: 'startanull.dev'
// };

// Change glob for BrowserSync reload
// conf.browserSync.watch = [
//   __dirname + path.sep + '**',
//   '!' + conf.source + path.sep + '**'
// ];

module.exports = conf;
