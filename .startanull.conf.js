// =====================================
// CONFIG
// =====================================
var path = require("path");
var conf = {};

// PATHS
// =====================================
conf.source = {};
conf.source.root = "src/";

conf.result = {};
conf.result.root = "assets/";


// Styles
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


// Scripts
conf.source.scripts = {};
conf.source.scripts.dir = conf.source.root+"scripts/";
conf.source.scripts.filename = "main.js";
conf.source.scripts.file = conf.source.scripts.dir + conf.source.scripts.filename;

conf.result.scripts = {};
conf.result.scripts.dir = conf.result.root+"js/";
conf.result.scripts.filename = "main.js";
conf.result.scripts.file = conf.result.scripts.dir + conf.result.scripts.filename;

// Webpack
conf.webpack = {
  entry: {
    app: ""
  },
  output: {
    path: "",
    filename: ""
  }
};
conf.webpack.entry.app = path.resolve(__dirname, conf.source.scripts.dir) + "/" + conf.source.scripts.filename;
conf.webpack.output.path = path.resolve(__dirname, conf.result.scripts.dir);
conf.webpack.output.filename = conf.result.scripts.filename;


// Templates
conf.source.templates = conf.source.root+"jade/*.jade";
conf.result.templates = conf.result.root;

module.exports = conf;
