'use strict';
const _ = require('underscore');
const tasks = require('./tasks');
const defaults = require('./defaults');

module.exports = (conf) => {
  // Disable modules if no config for them
  let disableStyles = true;
  let disableScripts = true;
  let disableTemplates = true;
  let disableImages = true;
  let confKeys = _.keys(conf);
  _.each(confKeys, (key) => {
    if (key.search('styles') >= 0) disableStyles = false;
    if (key.search('scripts') >= 0) disableScripts = false;
    if (key.search('templates') >= 0) disableTemplates = false;
    if (key.search('img') >= 0) disableImages = false;
  });

  let dis = {disableStyles, disableScripts, disableTemplates, disableImages};
  conf = _.defaults(conf, dis, defaults);

  tasks(conf);
};
