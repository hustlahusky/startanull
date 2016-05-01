// =====================================
// CONFIG
// =====================================
const path = require("path");
const fs = require("fs");
const fse = require('fs-extra');

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
try {
  var bowerConfig = fse.readJsonSync("./.bowerrc", {throws: false});

  if (bowerConfig)
    conf.bower = JSON.parse(JSON.stringify(bowerConfig));
} catch (err) {}

if (typeof conf.bower.directory == "undefined")
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
  jquery: path.resolve(conf.bower.directory, "jquery/dist")
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
conf.funcs.copyLib = function (lib) {
  fs.stat(conf.scripts.libs[lib], function (err, stats) {
    if (err) return console.error(err);

    if (stats.isDirectory()) {
      fse.copy(conf.scripts.libs[lib], conf.scripts.result.dir + path.sep + lib, function (err) {
        if (err) return console.error(err);
      });
    } else if (stats.isFile()) {
      // TODO: Copy file to conf.result.scripts.dir
      console.log("File");
    }
  });
};


// CUSTOM INJECTION
// =====================================
//conf.components = false;


// EXPORT
// =====================================
module.exports = conf;
