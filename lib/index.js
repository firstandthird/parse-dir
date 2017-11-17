'use strict';
const ParseDir = require('./ParseDir');
const util = require('util');
const wrapper = util.promisify((fileGlob, callback) => {
  const parser = new ParseDir({});
  parser.handleAsync(fileGlob, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
});

module.exports = wrapper;
