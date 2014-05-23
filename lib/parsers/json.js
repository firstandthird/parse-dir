(function() {
  "use strict";

  module.exports = function(meta, callback) {
    var output = null;

    try {
      output = JSON.parse(meta.raw);
    } catch(e) {
      callback(e);
      return;
    }

    callback(null, output);
  };
}());
