var parseDir = require('../lib/parse-dir').async;
var assert = require('assert');
var fs = require('fs');

var fixture = 'test/fixture/yaml/';

describe('yaml', function() {
  it('should be parsed', function(done) {
    parseDir(fixture + 'users.yaml', function(err, data) {
      assert(data[0].parsed);
      done();
    });
  });

  it('should contain filepath', function(done) {
    parseDir(fixture + 'users.yaml', function(err, data) {
      assert(data[0].filepath.indexOf(fixture + 'users.yaml') !== -1);
      done();
    });
  });

  it('should contain filename', function(done) {
    parseDir(fixture + 'users.yaml', function(err, data) {
      assert(data[0].filename === 'users.yaml');
      done();
    });
  });

  it('should contain basename', function(done) {
    parseDir(fixture + 'users.yaml', function(err, data) {
      assert(data[0].basename === 'users');
      done();
    });
  });

  it('should contain extension', function(done) {
    parseDir(fixture + 'users.yaml', function(err, data) {
      assert(data[0].extension === '.yaml');
      done();
    });
  });

  it('should return raw output', function(done) {
    parseDir(fixture + 'users.yaml', function(err, data) {
      assert(data[0].raw === fs.readFileSync(fixture + 'users.yaml').toString());
      done();
    });
  });

  it('should return parsed output', function(done) {
    parseDir(fixture + 'users.yaml', function(err, data) {
      assert(data[0].contents[0].name === 'John');
      done();
    });
  });

  it('should handle malformed yaml', function(done) {
    parseDir(fixture + 'malformed.yaml', function(err, data) {
      assert(!data[0].parsed);
      done();
    });
  });
});
