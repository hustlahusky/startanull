'use strict';

var Hello = require('./hello');

Hello.run();
Hello.err();
Hello.err("Crash!");

$(window).load(function () {
  $(document).foundation();
});
