'use strict';
let conf = {};

conf.globOptions = {dot: true};

// Styles
conf.stylesProc = require('gulp-less');
conf.stylesProcOpts = {};
conf.stylesAutoprefixer = {
  browsers: ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24',
    'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 7'],
  cascade: false
};
conf.stylesMaps = {
  includeContent: true
};

// Scripts
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
conf.templatesPugOpts = {
  locals: {},
  pretty: true
};

module.exports = conf;
