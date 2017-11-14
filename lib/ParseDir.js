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
    const self = this;
    return new Promise(async (resolve, reject) => {
      glob(pattern, async (err, files) => {
        if (err) {
          return reject(err);
        }
        async.each(files, (file, eachDone) => {
          this.fileParser.processFile(file, eachDone);
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
