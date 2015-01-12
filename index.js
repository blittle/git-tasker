var exec = require('child_process').exec;
var _  = require('lodash');
var minimatch = require("minimatch");
var colors = require('colors');
var async = require('async');

var commands = [];

module.exports = function(config, git_list_command) {
  exec(git_list_command || 'git diff --name-only HEAD@{1} HEAD',  function(error, stdout, stderr) {
    _.each(stdout.split('\n'), function(file) {
      file = file.trim(); 
      if(!file) return;

      _.each(config, function(option) {
        if(minimatch(file, option.matcher)) {
          console.log((file).blue + ("=>") + (option.command).green);
          commands.push(option.command);
        } else {
          console.log((file).blue + ("=>") + ("none").yellow);
        }
      });
    }, false);

    commands = _.unique(commands);

    console.log("Processing commands:");

    async.eachSeries(
      commands, 
      function(command, callback) {
        process.stdout.write(("\t"+command).blue + "...");
        exec(command, function(error, stdout, stderr) {
          if(error) {
            process.stdout.write(("Error\n").red);
            callback(stderr);
          } else {
            process.stdout.write(("Success\n").green);
            callback();
          }
        })
      }, 
      function(err) {
        if(err) {
          console.log((err).red);
        }
    })
  });
}
