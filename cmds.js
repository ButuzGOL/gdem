'use strict';

var inquirer = require('inquirer');

var gdem = require('./');

module.exports = {
  list: function() {
    var envs = gdem.list();

    if (envs.length) {
      envs.forEach(function(env) {
        console.log('  ' + env);
      });
    } else {
      console.log('Empty');
    }
  },
  create: function() {
    inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Name'
    }, {
      type: 'input',
      name: 'serviceAccountEmail',
      message: 'Service account email'
    }, {
      type: 'input',
      name: 'pathToKeyFile',
      message: 'Path to key file'
    }, {
      type: 'input',
      name: 'gitPath',
      message: 'Git path'
    }, {
      type: 'input',
      name: 'buildCommand',
      message: 'Build command'
    }], function(answers) {
      gdem.save(answers.name, answers, true);
    });
  },
  update: function(name) {
    var data = gdem.getData(name);
    
    inquirer.prompt([{
      type: 'input',
      name: 'serviceAccountEmail',
      message: 'Service account email',
      default: data.serviceAccountEmail
    }, {
      type: 'input',
      name: 'pathToKeyFile',
      message: 'Path to key file',
      default: data.pathToKeyFile
    }, {
      type: 'input',
      name: 'gitPath',
      message: 'Git path',
      default: data.gitPath
    }, {
      type: 'input',
      name: 'buildCommand',
      message: 'Build command',
      default: data.buildCommand
    }], function(answers) {
      gdem.save(name, answers);
    });
  },
  remove: function(name) {
    inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure?',
      default: true
    }, function(answers) {
      if (answers.confirm) gdem.remove(name);
    });
  },
  publish: function(name, cursor) {
    gdem.publish(name, cursor);
  }
};
