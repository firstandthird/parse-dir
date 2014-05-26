var parseDir = require('../lib/parse-dir');
var assert = require('assert');
var fs = require('fs');

var fixture = 'test/fixture/directories/';

describe('directories', function() {
  it('should return isDirectory', function(done) {
    parseDir(fixture + '**/*', function(err, data) {
      assert(data[0].isDirectory);
      assert.equal(data[1].isDirectory, false);
      done();
    });
  });

});
