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

// used by ParseDir to process and parse individual files:
class FileProcessor {
  constructor(options) {
    this.data = [];
    this.async = options.async !== undefined ? options.aync : true;
  }

  determineIfDirectory(meta, async_, done) {
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
    if (async_) {
      fs.lstat(meta.filepath, onLsStat);
    } else {
      onLsStat(null, fs.lstatSync(meta.filepath));
    }
  }

  getFileContents(meta, isDirectory, done) {
    // Get the files raw contents
    if (isDirectory) {
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
    if (async) {
      fs.readFile(meta.filepath, onFileRead);
    } else {
      onFileRead(null, fs.readFileSync(meta.filepath));
    }
  }

  parseFileContents(meta, fileContents, done) {
    // Parse the file using the correct lib
    if (!fileContents) {
      return done();
    }
    meta.raw = fileContents;
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
  }

  processFile(file, callback) {
    const isAsync = this.async;

    async.autoInject({
      async_: done => done(null, isAsync),
      meta: done => done(null, {
        relativePath: file,
        filepath: path.resolve(file),
        filename: path.basename(file),
        basename: path.basename(file, path.extname(file)),
        extension: path.extname(file),
        parsed: false
      }),
      isDirectory: this.determineIfDirectory,
      fileContents: this.getFileContents,
      parsedContents: this.parseFileContents
    },
    (err, results) => {
      const resultObject = results.meta;
      if (!err) {
        resultObject.isDirectory = results.isDirectory;
        resultObject.raw = results.fileContents;
        if (results.parsedContents) {
          resultObject.contents = results.parsedContents;
          resultObject.parsed = true;
        } else {
          if (!resultObject.isDirectory) {
            resultObject.contents = resultObject.raw;
          }
        }
      }
      this.data.push(resultObject);
      //TODO: errors aren't bubbling up
      //need to think about this since we don't want to throw a parse error.  or do we?
      callback();
    });
  }
}

// front-end to parse a directory at a time:
class ParseDir {
  constructor(options) {
    this.async = options.async !== undefined ? options.aync : true;
    this.fileParser = new FileProcessor(options);
  }

  sync(pattern) {
    const files = glob.sync(pattern);
    if (files) {
      try {
        for (let i = 0, len = files.length; i < len; i++) {
          const file = files[i];
          this.fileParser.processFile(file, noop);
        }
        return this.fileParser.data;
      } catch (e) {
        return e;
      }
    } else {
      return [];
    }
  }

  handleAsync(pattern, callback) {
    this.data = [];
    if (this.async) {
      glob(pattern, (err, files) => {
        if (err) {
          return callback(err);
        }
        async.each(files, (file, done) => {
          this.fileParser.processFile(file, done);
        }, (err2) => {
          callback(err2, this.fileParser.data);
        });
      });
      return;
    }
    return this.sync(pattern);
  }
}

const wrapper = (fileGlob, callback) => {
  const parser = new ParseDir({});
  parser.handleAsync(fileGlob, callback);
};
const sync = (fileGlob) => {
  const parser = new ParseDir({
    async: false
  });
  return parser.sync(fileGlob);
};
wrapper.sync = sync;
module.exports = wrapper;
