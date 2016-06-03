'use strict';

const _ = require('underscore');
const conf = require('./startanull-default-conf');
const path = require('path');

/**
 * CUSTOM INJECTION
 *
 * Rewrite any options you want in this file
 */

// conf.styles = false; // disable styles

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

module.exports = conf;
