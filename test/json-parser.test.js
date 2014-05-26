var parseDir = require('../lib/parse-dir');
var assert = require('assert');
var fs = require('fs');

var fixture = 'test/fixture/json/';

describe('json', function() {
  it('should be parsed', function(done) {
    parseDir(fixture + 'users.json', function(err, data) {
      assert(data[0].parsed);
      done();
    });
  });

  it('should contain filepath', function(done) {
    parseDir(fixture + 'users.json', function(err, data) {
      assert(data[0].filepath.indexOf(fixture + 'users.json') !== -1);
      done();
    });
  });

  it('should contain filename', function(done) {
    parseDir(fixture + 'users.json', function(err, data) {
      assert(data[0].filename === 'users.json');
      done();
    });
  });

  it('should contain basename', function(done) {
    parseDir(fixture + 'users.json', function(err, data) {
      assert(data[0].basename === 'users');
      done();
    });
  });

  it('should contain extension', function(done) {
    parseDir(fixture + 'users.json', function(err, data) {
      assert(data[0].extension === '.json');
      done();
    });
  });

  it('should return raw output', function(done) {
    parseDir(fixture + 'users.json', function(err, data) {
      assert(data[0].raw === fs.readFileSync(fixture + 'users.json').toString());
      done();
    });
  });

  it('should return parsed output', function(done) {
    parseDir(fixture + 'users.json', function(err, data) {
      assert(data[0].contents[0].name === 'John');
      done();
    });
  });

  it('should handle malformed json', function(done) {
    parseDir(fixture + 'malformed.json', function(err, data) {
      assert(!data[0].parsed);
      done();
    });
  });
});
