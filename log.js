'use strict';

var chalk = require('chalk');
var figures = require('figures');

module.exports = {
  success: function(text) {
    console.log(chalk.green(text, figures.tick));
  },
  error: function(text) {
    console.log(chalk.red(text, figures.cross));
  }
};
