#!/usr/bin/env node

/* global process */

'use strict';

process.bin = process.title = 'Google Drive environments manager';

var program = require('commander');
var inquirer = require('inquirer');

var pkg = require('./package.json');
var config = require('./config');
var utils = require('./utils');
var log = require('./log');
var gdem = require('./');

var init = function() {
  utils.createDir(config.rootDir);
};

init();

program
  .version(pkg.version)
  .usage('<command> [<args>]');

program
  .command('list')
  .description('list of environments')
  .action(function() {
    var envs = gdem.list();

    if (envs.length) {
      envs.forEach(function(env) {
        console.log('  ' + env);
      });
    } else {
      console.log('Empty');
    }
  });

program
  .command('create')
  .description('create environment')
  .action(function() {
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
  });

 program
  .command('update [name]')
  .description('update environment')
  .action(function(name) {
    var data = gdem.getData(name);

    if (!data) {
      log.error('Env not found');
      process.exit(1);
      return;
    }

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
  });

program
  .command('remove [name]')
  .description('remove environment')
  .action(function(name) {
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
            function() {
              log.error('Env not found');
              process.exit(1);
            }
          );
      }
    });
  });

program
  .command('publish [name] [cursor]')
  .description('publish based on cursor (branch, tag, hash)')
  .action(function(name, cursor) {
    if (!name || !cursor) {
      log.error('should be two args');
      process.exit(1);
      return;
    }
    gdem.publish(name, cursor);
  });

program.on('*', function() {
  console.log('Unknown Command: ' + program.args.join(' '));
  program.help();
});

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
