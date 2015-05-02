/* global process */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
  getUserHome: function() {
    return process.env.HOME || process.env.USERPROFILE;
  },
  createDir: function(srcPath) {
    if (!fs.existsSync(srcPath)) {
      fs.mkdirSync(srcPath);
    }
  },
  getDirs: function(srcPath) {
    return fs.readdirSync(srcPath)
      .filter(function(file) {
        return fs.statSync(path.join(srcPath, file)).isDirectory();
      });
  }
};
