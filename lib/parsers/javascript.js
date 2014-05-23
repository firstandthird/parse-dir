(function() {
  "use strict";

  module.exports = function(meta, callback) {
    var output = null;

    try {
      output = require(meta.filepath);
    } catch(e) {
      callback(e);
      return;
    }

    callback(null, output);
  };
}());
