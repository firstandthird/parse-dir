'use strict';
const fs = require('fs');
const path = require('path');
const async = require('async');

// Parsers
const jsonParser = require('./parsers/json');
const yamlParser = require('./parsers/yaml');
const jsParser = require('./parsers/javascript');

// used by ParseDir to process and parse individual files:
class FileProcessor {
  constructor(options) {
    this.data = [];
  }

  determineIfDirectory(meta, done) {
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
    fs.lstat(meta.filepath, onLsStat);
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
    fs.readFile(meta.filepath, onFileRead);
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

    async.autoInject({
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
      // bubble any error back up:
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  }
}

module.exports = FileProcessor;
