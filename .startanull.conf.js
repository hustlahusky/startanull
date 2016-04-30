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
conf.source.root = path.resolve(__dirname, "./src/");

conf.result = {};
conf.result.root = path.resolve(__dirname, "./assets/");


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

conf.styles.source = {};
conf.styles.source.dir = path.resolve(conf.source.root, "./styles/");
conf.styles.source.filename = "style.less";
conf.styles.source.file = conf.styles.source.dir + path.sep + conf.styles.source.filename;

conf.styles.result = {};
conf.styles.result.dir = path.resolve(conf.result.root, "./css/");
conf.styles.result.filename = "style.css";
conf.styles.result.file = conf.styles.result.dir + path.sep + conf.styles.result.filename;


// TODO remove
conf.cssPreprocessor = "scss";
conf.preprocessorOptions = {};
conf.source.styles = {};
conf.source.styles.dir =  conf.source.root+"styles/";
conf.source.styles.filename = "main."+conf.cssPreprocessor;
conf.source.styles.file = conf.source.styles.dir + conf.source.styles.filename;

conf.result.styles = {};
conf.result.styles.dir = conf.result.root+"css/";
conf.result.styles.filename = "main.css";
conf.result.styles.file = conf.result.styles.dir + conf.result.styles.filename;


// SCRIPTS
// =====================================

conf.scripts = {};
conf.scripts.source = {};
conf.scripts.source.dir = path.resolve(conf.source.root, "./scripts/");
conf.scripts.source.filename = "main.js";
conf.scripts.source.file = conf.scripts.source.dir + path.sep + conf.scripts.source.filename;

conf.scripts.result = {};
conf.scripts.result.dir = path.resolve(conf.result.root, "./js/");
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

// TODO remove
conf.source.scripts = {};
conf.source.scripts.dir = conf.source.root+"scripts/";
conf.source.scripts.filename = "main.js";
conf.source.scripts.file = conf.source.scripts.dir + conf.source.scripts.filename;

conf.result.scripts = {};
conf.result.scripts.dir = conf.result.root+"js/";
conf.result.scripts.filename = "main.js";
conf.result.scripts.file = conf.result.scripts.dir + conf.result.scripts.filename;




// TEMPLATES
// =====================================

conf.templates = {};

conf.templates.source = {};
conf.templates.source.dir = path.resolve(conf.source.root, "./jade/");
conf.templates.source.file = conf.templates.source.dir + path.sep + "*.jade";
conf.templates.source.locals = {};

conf.templates.result = {};
conf.templates.result.dir = conf.result.root;


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

module.exports = conf;
