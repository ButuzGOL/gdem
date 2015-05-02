'use stict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var git = require('nodegit');
var gdPages = require('gd-pages');

var config = require('./config');
var utils = require('./utils');

module.exports = {
  list: function() {
    return utils.getDirs(config.rootDir);
  },
  save: function(name, answers, isNew) {
    var envDir = path.join(config.rootDir, name);
    var data = {
      serviceAccountEmail: answers.serviceAccountEmail,
      pathToKeyFile: answers.pathToKeyFile,
      gitPath: answers.gitPath,
      buildCommand: answers.buildCommand
    };
    
    if (isNew) fs.mkdirSync(envDir);
  
    fs.writeFileSync(envDir + '/.gdem', JSON.stringify(data, null, 2));
  },
  remove: function(name) {
    rimraf(path.join(config.rootDir, name), function() {});
  },
  publish: function(name, cursor) {
    console.log('publish', name, cursor);
    return;
    var data = this.getData(name);
    var envDir = path.join(config.rootDir, name);
    
    git.Clone.clone(data.gitPath, path.join(envDir, 'repo'), {
        remoteCallbacks: {
          certificateCheck: function() {
            return 1;
          }
        }
      })
      .then(function() {
        console.log('cloned');
      });
  },
  getData: function(name) {
    var envDir = path.join(config.rootDir, name);
    return JSON.parse(fs.readFileSync(path.join(envDir, '.gdem')));
  }  
};