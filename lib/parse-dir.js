(function() {
  'use strict';

  const glob = require('glob');
  const async = require('async');
  const fs = require('fs');
  const path = require('path');
  const noop = function() {};

  // Parsers
  const jsonParser = require('./parsers/json');
  const yamlParser = require('./parsers/yaml');
  const jsParser = require('./parsers/javascript');

  const ParseDir = function() {
    const that = this;

    const sync = (pattern) => {
      that.data = [];
      that.__assync = true;

      const files = glob.sync(pattern);

      if (files) {
        try {
          for (let i = 0, len = files.length; i < len; i++) {
            const file = files[i];

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

    const handleAsync = (pattern, callback) => {
      that.data = [];
      that.__assync = typeof callback === 'function';

      if (that.__assync) {
        glob(pattern, (err, files) => {
          if (err) {
            return callback(err);
          }
          async.each(files, that.parseFile.bind(that), (err2) => {
            callback(err2, that.data);
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
    const meta = {
      relativePath: file,
      filepath: path.resolve(file),
      filename: path.basename(file),
      basename: path.basename(file, path.extname(file)),
      extension: path.extname(file),
      parsed: false
    };
    const that = this;

    async.series([
      function(done) {
        const onLsStat = (err, stats) => {
          let error = null;

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
      (done) => {
        // Get the files raw contents
        if (meta.isDirectory) {
          return done();
        }
        const onFileRead = (err, fileData) => {
          let error = null;

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
            return done();
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
