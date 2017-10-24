'use strict';
const ParseDir = require('./ParseDir');

const wrapper = (fileGlob, callback) => {
  const parser = new ParseDir({});
  parser.handleAsync(fileGlob, callback);
};

module.exports = wrapper;
