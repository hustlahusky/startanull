"use strict";

// =====================================
// CONFIG
// =====================================
const path = require("path");
const conf = {};

// PATHS
// =====================================

conf.source = {};
conf.source.root = path.resolve(__dirname, "src");

conf.result = {};
conf.result.root = path.resolve(__dirname, "assets");


// BOWER
// =====================================

conf.bower = {};
conf.bower.directory = path.resolve(conf.source.root, "bower_components");


// STYLES
// =====================================

conf.styles = {};

conf.styles.preprocessor = {};
conf.styles.preprocessor.instance = require('gulp-less');
conf.styles.preprocessor.options = {};

conf.styles.autoprefixer = {
  browsers: ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24', 'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 7'],
  cascade: false
};

conf.styles.source = {};
conf.styles.source.dir = path.resolve(conf.source.root, "styles");
conf.styles.source.filename = "style.less";
conf.styles.source.file = conf.styles.source.dir + path.sep + conf.styles.source.filename;

conf.styles.result = {};
conf.styles.result.dir = path.resolve(conf.result.root, "css");
conf.styles.result.filename = "style.css";
conf.styles.result.file = conf.styles.result.dir + path.sep + conf.styles.result.filename;


// SCRIPTS
// =====================================

conf.scripts = {};
conf.scripts.source = {};
conf.scripts.source.dir = path.resolve(conf.source.root, "scripts");
conf.scripts.source.filename = "main.js";
conf.scripts.source.file = conf.scripts.source.dir + path.sep + conf.scripts.source.filename;

conf.scripts.result = {};
conf.scripts.result.dir = path.resolve(conf.result.root, "js");
conf.scripts.result.filename = "main.js";
conf.scripts.result.file = conf.scripts.result.dir + path.sep + conf.scripts.result.filename;

// WEBPACK
conf.scripts.webpack = {};

/*conf.scripts.webpack.entry = {};
conf.scripts.webpack.app = conf.scripts.source.file;*/

conf.scripts.webpack.output = {};
// conf.scripts.webpack.output.path = conf.scripts.result.dir;
conf.scripts.webpack.output.filename = conf.scripts.result.filename;

// LIBS
conf.scripts.libs = {
  jquery: path.resolve(conf.bower.directory, "jquery/dist")  + path.sep + "**",
  test: [
    path.resolve(conf.bower.directory, "jquery/dist") + path.sep + "jquery.js",
    path.resolve(conf.bower.directory, "jquery/dist") + path.sep + "jquery.slim.js",
  ]
};


// TEMPLATES
// =====================================

conf.templates = {};

conf.templates.source = {};
conf.templates.source.dir = path.resolve(conf.source.root, "jade");
conf.templates.source.file = conf.templates.source.dir + path.sep + "*.jade";
conf.templates.source.locals = {};

conf.templates.result = {};
conf.templates.result.dir = conf.result.root;


// COMPONENTS
// =====================================

conf.components = {};

conf.components.root = path.resolve(__dirname, "components");
conf.components.mask = conf.components.root + path.sep + "*";
conf.components.source = conf.components.mask + path.sep + "src";
conf.components.result = conf.components.mask;


conf.components.styles = {};
conf.components.styles.source = {};
conf.components.styles.source.dirname = "styles";
conf.components.styles.source.dir = conf.components.source + path.sep + conf.components.styles.source.dirname;
conf.components.styles.source.filename = "style.less";
conf.components.styles.source.file = conf.components.styles.source.dir + path.sep + conf.components.styles.source.filename;

conf.components.styles.result = {};
conf.components.styles.result.dirname = "css";
conf.components.styles.result.dir = conf.components.result + path.sep + conf.components.styles.result.dirname;
conf.components.styles.result.filename = "style.css";
conf.components.styles.result.file = conf.components.styles.result.dir + path.sep + conf.components.styles.result.filename;


conf.components.scripts = {};
conf.components.scripts.source = {};
conf.components.scripts.source.dirname = "scripts";
conf.components.scripts.source.dir = conf.components.source + path.sep + conf.components.scripts.source.dirname;
conf.components.scripts.source.filename = "script.js";
conf.components.scripts.source.file = conf.components.scripts.source.dir + path.sep + conf.components.scripts.source.filename;

conf.components.scripts.result = {};
conf.components.scripts.result.dirname = "js";
conf.components.scripts.result.dir = conf.components.result + path.sep + conf.components.scripts.result.dirname;
conf.components.scripts.result.filename = "script.js";
conf.components.scripts.result.file = conf.components.scripts.result.dir + path.sep + conf.components.scripts.result.filename;


conf.components.templates = {};

conf.components.templates.source = {};
conf.components.templates.source.dirname = "jade";
conf.components.templates.source.dir = conf.components.source + path.sep + conf.components.templates.source.dirname;
conf.components.templates.source.file = conf.components.templates.source.dir + path.sep + "*.jade";

conf.components.templates.result = {};
conf.components.templates.result.dirname = ".";
conf.components.templates.result.dir = conf.components.result + path.sep + conf.components.templates.result.dirname;


// FUNCTIONS
// =====================================

conf.funcs = {};

// copyLib
// copy library from conf.scripts.libs to conf.scripts.result.dir
conf.funcs.copyLib = function (lib, gulp) {
  let library;
  let dest;

  // Check for gulp
  if (!gulp) return console.error("Gulp instance not provided");

  // Set library and dest
  if (conf.scripts.libs.hasOwnProperty(lib)) {
    library = conf.scripts.libs[lib];
    dest = lib;
  } else {
    return console.error("library not exist!");
  }

  // Copy files
  return gulp.src(library, {
      dot: true
    })
    .pipe(gulp.dest(path.resolve(conf.scripts.result.dir, dest)));
};

// Check is obj empty
conf.funcs.isEmpty = function (obj) {

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // Otherwise, does it have any properties of its own?
  for (let key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
};


// CUSTOM INJECTION
// =====================================
// conf.styles = false;


// EXPORT
// =====================================
module.exports = conf;
