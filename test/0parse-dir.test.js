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

  it('should return relative paths', function(done) {
    parseDir('test/fixture/json/*.json', function(err, data) {
      assert.equal(data.length, 2);
      assert(data[0].relativePath, 'test/fixture/json/malformed.json');
      assert(data[1].relativePath, 'test/fixture/json/users.json');
      done();
    });
  });

  describe('directories', function() {
    it('should return isDirectory', function(done) {
      parseDir('test/fixture/directories/**/*', function(err, data) {
        assert(data[0].isDirectory);
        assert.equal(data[1].isDirectory, false);
        done();
      });
    });
  });

  describe('unknown files', function() {
    it('should return parsed = false for unknown files', function(done) {
      parseDir('test/fixture/unknown/**/*', function(err, data) {
        assert.equal(data[0].parsed, false);
        done();
      });
    });

    it('should return raw == contents if not parsed', function(done) {
      parseDir('test/fixture/unknown/**/*', function(err, data) {
        assert.equal(data[0].contents, data[0].raw);
        done();
      });
    });
  });
});
