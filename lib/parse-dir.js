(function() {
  "use strict";

  var glob = require('glob');
  var async = require('async');
  var fs = require('fs');
  var path = require('path');

  // Parsers
  var jsonParser = require('./parsers/json');

  var ParseDir = function() {
    var that = this;

    return function(pattern, callback) {
      that.data = [];

      glob(pattern, function(err, files) {
        if(err) {
          callback(err);
          return;
        }

        async.each(files, that.parseFile.bind(that), function(err) {
          callback(err, that.data);
        });
      });
    };
  };

  ParseDir.prototype.parseFile = function(file, callback) {
    var meta = {
      filepath: path.resolve(file),
      filename: path.basename(file),
      basename: path.basename(file, path.extname(file)),
      extension: path.extname(file),
      parsed: false
    };

    async.series([
      function(done) {
        // Get the files raw contents
        fs.readFile(meta.filepath, function(err, fileData) {
          if(!err) {
            meta.raw = fileData.toString();
          }

          done(err);
        });
      },
      function(done) {
        // Parse the file using the correct lib

        switch(meta.extension) {
          case '.json':
            jsonParser(meta, done);
            break;
        }
      }.bind(this)], function(err, data) {
        if(!err) {
          meta.contents = data[1];
          meta.parsed = true;
        }

        this.data.push(meta);
        callback();
      }.bind(this));
  };

  module.exports = exports = new ParseDir();
}());
