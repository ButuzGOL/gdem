#!/usr/bin/env node

/* global process */

'use strict';

process.bin = process.title = 'Google Drive environments manager';

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
  .description('publish based on cursor (branch, tag, hash)')
  .action(cmds.publish);

program.parse(process.argv);
