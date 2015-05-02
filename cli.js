#!/usr/bin/env node

// gdem create
// prompt:
// 1. Name
// 2. Service account -> Email address:
// 3. Path to pem file
// 4. Git path
// 5. Folder name on gd
// 6. Build command
// gdem remove `name`
// prompt: are you sure
// gdem list
// gdem update `name`
// prompt: ... same as in create but with values
// gdem publish `name` `cursor`
// steps:
// git pull
// git checkout master
// run `build command`
// publish on gd

/* global process */

'use stict';

process.bin = process.title = 'Google Drive environments manager';

var fs = require('fs');
var path = require('path');
var program = require('commander');

var pkg = require('./package.json');
var config = require('./config');
var utils = require('./utils');

var cmds = require('./cmds');

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
  .action(cmds.list);

program
  .command('create')
  .description('create environment')
  .action(cmds.create);
  
 program
  .command('update [name]')
  .description('update environment')
  .action(cmds.update);
  
program
  .command('remove [name]')
  .description('remove environment')
  .action(cmds.remove);

program
  .command('publish [name] [cursor]')
  .description('publish based on cursor (branch, teg, hash)')
  .action(cmds.publish);
  
program.parse(process.argv);
