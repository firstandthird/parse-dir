(function() {
  'use strict';

  const yaml = require('js-yaml');

  module.exports = (meta, callback) => {
    let output = null;

    try {
      output = yaml.safeLoad(meta.raw);
    } catch (e) {
      return callback(e);
    }

    callback(null, output);
  };
}());
