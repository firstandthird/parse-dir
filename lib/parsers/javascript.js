(function() {
  'use strict';

  module.exports = (meta, callback) => {
    let output = null;

    try {
      output = require(meta.filepath);
    } catch (e) {
      return callback(e);
    }
    callback(null, output);
  };
}());
