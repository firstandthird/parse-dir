'use strict';
const ParseDir = require('./ParseDir');

const wrapper = async (fileGlob) => {
  const parser = new ParseDir({});
  return await parser.handleAsync(fileGlob);
};

module.exports = wrapper;
