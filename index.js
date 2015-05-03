/* global Promise */
'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var gdPages = require('gd-pages');
var git = require('simple-git');

var config = require('./config');
var utils = require('./utils');
var log = require('./log');

var exec = require('child_process').exec;

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
      buildCommand: answers.buildCommand,
      buildDir: answers.buildDir
    };

    if (isNew) fs.mkdirSync(envDir);

    fs.writeFileSync(envDir + '/.gdem', JSON.stringify(data, null, 2));
  },
  remove: function(name) {
    return new Promise(function(resolve, reject) {
      if (!this.getData(name)) reject(null);

      rimraf(path.join(config.rootDir, name), function(err) {
        if (err) return reject(err);

        resolve();
      });
    }.bind(this));
  },
  publish: function(name, cursor) {
    var data = this.getData(name);
    var envDir = path.join(config.rootDir, name);
    var repoDir = path.join(envDir, 'repo');

    var cloneOrExists = function() {
      return new Promise(function(resolve, reject) {
        if (fs.existsSync(repoDir)) return resolve();

        git().clone(data.gitPath, repoDir, function(err) {
          if (err) return reject(err);

          resolve();
        });
      });
    };

    var pull = function() {
     return new Promise(function(resolve, reject) {
        git
          .checkout('master')
          .pull(function(err) {
            if (err) return reject(err);
            resolve();
          });
      });
    };

    var checkout = function(cursor) {
      return new Promise(function(resolve, reject) {
        git.checkout(cursor, function(err) {
          if (err) return reject(err);
          resolve();
        });
      });
    };

    var runBuildCommand = function() {
      return new Promise(function(resolve, reject) {
        exec('cd ' + repoDir + ' && ' + data.buildCommand,
          function(err, stdout, stderr) {
            if (err) return reject(err);

            console.log(stdout, stderr);
            resolve();
          });
      });
    };

    var publishToGD = function() {
      return gdPages(
        data.serviceAccountEmail,
        data.pathToKeyFile,
        path.join(repoDir, data.buildDir),
        'env'
//        [name, cursor].join('/')
      );
    };

    cloneOrExists()
      .then(function() {
        log.success('Repo ready');

        git = git(repoDir);

        console.log('Pull...');
        return pull();
      })
      .then(function() {
        console.log('Checkout...');
        return checkout(cursor);
      })
      .then(function() {
        console.log('Running build command');
        return runBuildCommand();
      })
      .then(function() {
        console.log('Publishing to Google Drive');
        return publishToGD();
      })
      .catch(function(err) {
        log.error('Error: ' + err);
      });
  },
  getData: function(name) {
    var envDir = path.join(config.rootDir, name);
    try {
      return JSON.parse(fs.readFileSync(path.join(envDir, '.gdem')));
    } catch(e) {
      return null;
    }
  }
};
