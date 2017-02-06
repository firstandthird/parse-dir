'use strict';
const ParseDir = require('./ParseDir');

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
