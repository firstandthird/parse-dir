(function() {
  'use strict';

  var glob = require('glob');
  var async = require('async');
  var fs = require('fs');
  var path = require('path');
  var noop = function() {};

  // Parsers
  var jsonParser = require('./parsers/json');
  var yamlParser = require('./parsers/yaml');
  var jsParser = require('./parsers/javascript');

  var ParseDir = function() {
    var that = this;

    var sync = function (pattern) {
      that.data = [];
      that.__assync = true;

      var files = glob.sync(pattern);

      if (files) {
        try {
          for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i];

            that.parseFile.call(that, file, noop);
          }
          return that.data;
        } catch (e) {
          return e;
        }
      } else {
        return [];
      }
    };

    var handleAsync = function(pattern, callback) {
      that.data = [];
      that.__assync = typeof callback === 'function';

      if (that.__assync) {
        glob(pattern, function(err, files) {
          if (err) {
            callback(err);
            return;
          }

          async.each(files, that.parseFile.bind(that), function(err) {
            callback(err, that.data);
          });
        });

        return;
      }

      return sync(pattern);
    };
    handleAsync.sync = sync.bind(that);

    return handleAsync;
  };

  ParseDir.prototype.parseFile = function(file, callback) {
    var meta = {
      relativePath: file,
      filepath: path.resolve(file),
      filename: path.basename(file),
      basename: path.basename(file, path.extname(file)),
      extension: path.extname(file),
      parsed: false
    };
    var that = this;

    async.series([
      function(done) {
        var onLsStat = function (err, stats) {
          var error = null;

          if (err || !stats) {
            error = err || true;
          }

          if (!error) {
            meta.isDirectory = stats.isDirectory();
          }

          done(error);
        };

        if (that.__async) {
          fs.lstat(meta.filepath, onLsStat);
        } else {
          onLsStat(null, fs.lstatSync(meta.filepath));
        }
      },
      function(done) {
        // Get the files raw contents
        if (meta.isDirectory) {
          return done();
        }
        var onFileRead = function (err, fileData) {
          var error = null;

          if (err || !fileData) {
            error = err || true;
          }

          if (!error) {
            meta.raw = fileData.toString();
          }

          done(error);
        };

        if (that.__async) {
          fs.readFile(meta.filepath, onFileRead);
        } else {
          onFileRead(null, fs.readFileSync(meta.filepath));
        }
      },
      function(done) {
        // Parse the file using the correct lib

        if (meta.isDirectory) {
          return done();
        }

        switch (meta.extension) {
          case '.json':
            jsonParser(meta, done);
            break;
          case '.yml':
          case '.yaml':
            yamlParser(meta, done);
            break;
          case '.coffee':
          case '.litcoffee':
          case '.ls':
          case '.livescript':
          case '.js':
            jsParser(meta, done);
            break;
          default:
            done();
            break;
        }
      }.bind(this)], function(err, data) {
        if (!err) {
          if (data[2]) {
            meta.contents = data[2];
            meta.parsed = true;
          } else {
            meta.contents = meta.raw;
          }
        }

        this.data.push(meta);
        //TODO: errors aren't bubbling up
        //need to think about this since we don't want to throw a parse error.  or do we?
        callback();
      }.bind(this));
  };

  module.exports = exports = new ParseDir();
}());
