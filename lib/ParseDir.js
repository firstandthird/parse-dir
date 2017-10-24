'use strict';
const FileProcessor = require('./FileProcessor');
const glob = require('glob');
const async = require('async');

// front-end to parse a directory at a time:
class ParseDir {
  constructor(options) {
    this.fileParser = new FileProcessor(options);
  }

  handleAsync(pattern, callback) {
    this.data = [];
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
}

module.exports = ParseDir;
