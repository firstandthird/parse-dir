var parseDir = require('../lib/parse-dir');
var assert = require('assert');

describe('parse-dir', function() {
  it('should be a function', function() {
    assert(typeof parseDir === 'function');
  });

  it('should handle multiple files', function(done) {
    parseDir('test/fixture/**/*', function(err, data) {
      assert(data.length > 1);
      done();
    });
  });
});
