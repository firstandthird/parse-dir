(function() {
  "use strict";

  var yaml = require('js-yaml');

  module.exports = function(meta, callback) {
    var output = null;

    try {
      output = yaml.safeLoad(meta.raw);
    } catch(e) {
      callback(e);
      return;
    }

    callback(null, output);
  };
}());
