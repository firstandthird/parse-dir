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
  constructor() {
    this.data = [];
    this.__async = true;
  }
  sync (pattern) {
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
        async.each(files, this.parseFile, (err2) => {
          callback(err2, this.data);
        });
      });
      return;
    }
    return this.sync(pattern);
  }

  parseFile (file, callback) {
    const meta = {
      relativePath: file,
      filepath: path.resolve(file),
      filename: path.basename(file),
      basename: path.basename(file, path.extname(file)),
      extension: path.extname(file),
      parsed: false
    };
    const statFile = function(done) {
      const isAsync = this.__async;
      console.log('statfile')
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
      console.log('async is ', isAsync)
      if (isAsync) {
        console.log('lstat')
        fs.lstat(meta.filepath, onLsStat);
      } else {
        console.log('onLsStat');
        onLsStat(null, fs.lstatSync(meta.filepath));
      }
    };

    async.series([statFile,
      (done) => {
        console.log('this is next..........')
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

        if (this.__async) {
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
          case '.ls':
          case '.livescript':
          case '.js':
            jsParser(meta, done);
            break;
          default:
            return done();
        }
      }], function(err, data) {
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
      });
  };

}

const wrapper = (glob, callback) => {
  const parser = new ParseDir();
  parser.handleAsync(glob, callback);
};
const sync = (glob) => {
  const parser = new ParseDir();
  return parser.sync(glob);
};
wrapper.sync = sync;
module.exports = wrapper;
