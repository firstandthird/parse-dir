(function() {
  "use strict";

  var glob = require('glob');
  var async = require('async');
  var fs = require('fs');
  var path = require('path');

  // Parsers
  var jsonParser = require('./parsers/json');
  var yamlParser = require('./parsers/yaml');
  var jsParser = require('./parsers/javascript');

  var ParseDir = function() {
    var that = this;

    return function(pattern, callback) {
      that.data = [];

      glob(pattern, function(err, files) {
        if(err) {
          callback(err);
          return;
        }

        async.each(files, that.parseFile.bind(that), function(err) {
          callback(err, that.data);
        });
      });
    };
  };

  ParseDir.prototype.parseFile = function(file, callback) {
    var meta = {
      filepath: path.resolve(file),
      filename: path.basename(file),
      basename: path.basename(file, path.extname(file)),
      extension: path.extname(file),
      parsed: false
    };

    async.series([
      function(done) {
        // Get lstat
        fs.lstat(meta.filepath, function(err, stats) {
          if (!err) {
            meta.isDirectory = stats.isDirectory();
          }

          done(err);
        });
      },
      function(done) {
        // Get the files raw contents
        if (meta.isDirectory) {
          return done();
        }
        fs.readFile(meta.filepath, function(err, fileData) {
          if(!err) {
            meta.raw = fileData.toString();
          }

          done(err);
        });
      },
      function(done) {
        // Parse the file using the correct lib

        if (meta.isDirectory) {
          return done();
        }

        switch(meta.extension) {
          case '.json':
            jsonParser(meta, done);
            break;
          case '.yaml':
            yamlParser(meta, done);
            break;
          case '.js':
            jsParser(meta, done);
            break;
          default:
            done();
            break;
        }
      }.bind(this)], function(err, data) {
        if(!err) {
          if (data[2]) {
            meta.contents = data[2];
            meta.parsed = true;
          } else {
            meta.contents = meta.raw;
          }
        }

        this.data.push(meta);
        callback(err);
      }.bind(this));
  };

  module.exports = exports = new ParseDir();
}());
