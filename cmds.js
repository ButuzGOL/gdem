'use strict';

var inquirer = require('inquirer');

var log = require('./log');
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
      message: 'Name',
      validate: function(value) {
        var envs = gdem.list();
        if (envs.indexOf(value) === -1) return true;

        return 'This env name already taken';
      }
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
      message: 'Build command',
      default: 'sh build.sh'
    }, {
      type: 'input',
      name: 'buildDir',
      message: 'Build directory',
      default: 'dist'
    }], function(answers) {
      gdem.save(answers.name, answers, true);

      log.success('Env created');
    });
  },
  update: function(name) {
    var data = gdem.getData(name);

    if (!data) return log.error('Env not found');

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
    }, {
      type: 'input',
      name: 'buildDir',
      message: 'Build directory',
      default: data.buildDir
    }], function(answers) {
      gdem.save(name, answers);

      log.success('Env updated');
    });
  },
  remove: function(name) {
    inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure?',
      default: true
    }, function(answers) {
      if (answers.confirm) {
        gdem.remove(name)
          .then(
            log.success.bind(log, 'Env removed'),
            log.error.bind(log, 'Env not found')
          );
      }
    });
  },
  publish: function(name, cursor) {
    if (!name || !cursor) return log.error('should be two args');
    gdem.publish(name, cursor);
  }
};
