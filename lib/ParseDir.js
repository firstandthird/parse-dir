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
    const self = this;
    return new Promise(async (resolve, reject) => {
      glob(pattern, async (err, files) => {
        if (err) {
          return reject(err);
        }
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const result = await this.fileParser.processFile(file);
          } catch (e) {
            return reject(e);
          }
        }
        resolve(this.fileParser.data);
      });
    });
  }
}

module.exports = ParseDir;
