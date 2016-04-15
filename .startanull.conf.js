// =====================================
// CONFIG
// =====================================
var path = require("path");

var conf = {
  cssPreprocessor: "scss",
  preprocessorOptions: {},
  webpack: {
    entry: {
      app: ""
    },
    output: {
      path: "",
      filename: ""
    }
  }
};

// PATHS
// =====================================
conf.source = {};
conf.source.root = "src/";
conf.source.styles = conf.source.root+"styles/";
conf.source.scripts = conf.source.root+"scripts/";
conf.source.mainStyle = conf.source.styles+"main."+conf.cssPreprocessor;
conf.source.mainScript = "main.js";
conf.source.templates = conf.source.root+"jade/*.jade";

conf.result = {};
conf.result.root = "assets/";
conf.result.styles = conf.result.root+"css/";
conf.result.scripts = conf.result.root+"js/";
conf.result.mainStyle = conf.result.styles+"main.css";
conf.result.mainScript = conf.result.scripts+"main.js";
conf.result.templates = conf.result.root;

conf.webpack.entry.app = path.resolve(__dirname, conf.source.scripts) + "/" + conf.source.mainScript;
conf.webpack.output.path = path.resolve(__dirname, conf.result.scripts);
conf.webpack.output.filename = "main.js";

module.exports = conf;
