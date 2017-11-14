'use strict';
const FileProcessor = require('./FileProcessor');
const glob = require('glob');
const async = require('async');

// front-end to parse a directory at a time:
class ParseDir {
  constructor(options) {
    this.fileParser = new FileProcessor(options);
  }

  handleAsync(pattern) {
    this.data = [];
    return new Promise((resolve, reject) => {
      glob(pattern, (err, files) => {
        if (err) {
          return reject(err);
        }
        async.each(files, (file, done) => {
          this.fileParser.processFile(file, done);
        }, (err2) => {
          if (err2) {
            return reject(err2);
          }
          return resolve(this.fileParser.data);
        });
      });
    });
  }
}

module.exports = ParseDir;
