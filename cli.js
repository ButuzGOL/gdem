#!/usr/bin/env node

'use strict';

process.bin = process.title = 'gdem';

var fs = require('fs');
var program = require('commander');
var inquirer = require('inquirer');
var rimraf = require('rimraf');

var pkg = require('./package.json');

var rootFolderPath = getUserHome() + '/.gdem';

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

function createRootFolder() {
  if (!fs.existsSync(rootFolderPath)) {
    fs.mkdirSync(rootFolderPath);
  }
}

function create(answers) {
  var projectFolderPath = rootFolderPath + '/' + answers.name;
  var data;

  fs.mkdirSync(projectFolderPath);

  data = {
    serviceAccountEmail: answers.serviceAccountEmail,
    pathToKeyFile: answers.pathToKeyFile,
    gitPath: answers.gitPath,
    buildCommand: answers.buildCommand
  };

  fs.writeFileSync(projectFolderPath + '/.gdem',
    JSON.stringify(data, null, 2));
}

function createCommand() {
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
    create(answers);
  });
}

function remove(name) {
  rimraf(rootFolderPath + '/' + name, function() {});
}

function removeCommand(command, name) {
  inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: 'Are you sure?',
    default: true
  }, function(answers) {
    if (answers.confirm) remove(name);
  });
}

function update(name, answers) {
  var projectFolderPath = rootFolderPath + '/' + name;
  var data = {
    serviceAccountEmail: answers.serviceAccountEmail,
    pathToKeyFile: answers.pathToKeyFile,
    gitPath: answers.gitPath,
    buildCommand: answers.buildCommand
  };

  fs.writeFileSync(projectFolderPath + '/.gdem',
    JSON.stringify(data, null, 2));
}

function updateCommand(command, name) {
  var projectFolderPath = rootFolderPath + '/' + name;
  var data = JSON.parse(fs.readFileSync(projectFolderPath + '/.gdem', 'utf8'));

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
    update(name, answers);
  });
}

createRootFolder();

program
  .version(pkg.version)
  .usage('<command> [<args>]');
  // .command('create [name]', 'create environment')
  // .command('remove [name]', 'remove environment')
  // .command('update', 'update current environment')
  // .command('publish [cursor]', 'publish based on cursor (branch, teg, hash)');

program
  .command('<create>', 'create environment')
  .action(updateCommand);

program.parse(process.argv);
