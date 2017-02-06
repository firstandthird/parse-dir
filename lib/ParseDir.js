'use strict';
const FileProcessor = require('./FileProcessor');
const glob = require('glob');
const async = require('async');
const noop = function() {};

// front-end to parse a directory at a time:
class ParseDir {
  constructor(options) {
    this.async = options.async !== undefined ? options.async : true;
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

module.exports = ParseDir;
