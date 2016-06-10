'use strict';

const _ = require('underscore');
const conf = require('./startanull-default-conf');
const path = require('path');

/**
 * CUSTOM INJECTION
 *
 * Rewrite any options you want in this file
 */

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
// conf.scripts.webpackStream.externals = {
//   jquery: '$'
// };
//
// conf.scripts.webpackStream.devtool = 'eval';

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
// conf.browserSync = {
//   proxy: 'startanull.dev'
// };

module.exports = conf;
