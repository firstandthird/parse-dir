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
class ParseDir {
  constructor(options) {
    this.data = [];
    this.__async = options.async !== undefined ? options.aync : true;
  }

  sync (pattern) {
    this.data = [];
    const files = glob.sync(pattern);
    if (files) {
      try {
        for (let i = 0, len = files.length; i < len; i++) {
          const file = files[i];
          this.parseFile(file, noop);
        }
        return this.data;
      } catch (e) {
        return e;
      }
    } else {
      return [];
    }
  }

  handleAsync (pattern, callback) {
    this.data = [];
    if (this.__async) {
      glob(pattern, (err, files) => {
        if (err) {
          return callback(err);
        }
        async.each(files, (file, done) => {
          this.parseFile(file, done);
        }, (err2) => {
          callback(err2, this.data);
        });
      });
      return;
    }
    return this.sync(pattern);
  }

  parseFile (file, callback) {
    const isAsync = this.__async;

    const determineIfDirectory = (done, results) => {
        const onLsStat = (err, stats) => {
          let error = null;
          if (err || !stats) {
            error = err || true;
          }
          if (!error) {
            return done(null, stats.isDirectory());
          }
          return done(error);
        };
        if (results.__async) {
          fs.lstat(results.meta.filepath, onLsStat);
        } else {
          onLsStat(null, fs.lstatSync(results.meta.filepath));
        }
      };

    const getFileContents = (done, results) => {
      // Get the files raw contents
      if (results.isDirectory) {
        return done();
      }
      const onFileRead = (err, fileData) => {
        let error = null;
        if (err || !fileData) {
          error = err || true;
        }
        if (!error) {
          return done(null, fileData.toString());
        }
        done(error);
      };
      if (results.__async) {
        fs.readFile(results.meta.filepath, onFileRead);
      } else {
        onFileRead(null, fs.readFileSync(results.meta.filepath));
      }
    };

    const parseString = (done, results) => {
      // Parse the file using the correct lib
      const meta = results.meta;
      if (!results.fileContents) {
        return done();
      }
      meta.raw = results.fileContents;
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
    };
    async.auto(
      {
        __async: (done) => {
          return done(null, isAsync);
        },
        meta: (done) => {
          return done(null, {
            relativePath: file,
            filepath: path.resolve(file),
            filename: path.basename(file),
            basename: path.basename(file, path.extname(file)),
            extension: path.extname(file),
            parsed: false
          });
        },
        isDirectory: ['meta', '__async', determineIfDirectory],
        fileContents: ['isDirectory', getFileContents],
        parsedContents: ['fileContents', parseString]
      },
      (err, results) => {
        if (!err) {
          results.meta.isDirectory = results.isDirectory;
          results.meta.raw = results.fileContents;
          if (results.parsedContents) {
            results.meta.contents = results.parsedContents;
            results.meta.parsed = true;
          } else {
            if (!results.meta.isDirectory) {
              results.meta.contents = results.meta.raw;
            }
          }
        }
        this.data.push(results.meta);
        //TODO: errors aren't bubbling up
        //need to think about this since we don't want to throw a parse error.  or do we?
        callback();
      });
  }
}

const wrapper = (glob, callback) => {
  const parser = new ParseDir({});
  parser.handleAsync(glob, callback);
};
const sync = (glob) => {
  const parser = new ParseDir({
    async: false
  });
  return parser.sync(glob);
};
wrapper.sync = sync;
module.exports = wrapper;
