'use strict';
const ParseDir = require('./ParseDir');

const wrapper = (fileGlob, callback) => {
  const parser = new ParseDir({});
  return parser.handleAsync(fileGlob);
};

module.exports = wrapper;
