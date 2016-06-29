(function() {
  "use strict";

  module.exports = (meta, callback) => {
    let output = null;

    try {
      output = JSON.parse(meta.raw);
    } catch (e) {
      return callback(e);
    }

    callback(null, output);
  };
}());
