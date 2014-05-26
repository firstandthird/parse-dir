var parseDir = require('../lib/parse-dir');
var assert = require('assert');
var fs = require('fs');

var fixture = 'test/fixture/livescript/';

describe('livescript', function() {
  it.skip('should be parsed', function(done) {
    parseDir(fixture + 'users.ls', function(err, data) {
      assert(data[0].parsed);
      done();
    });
  });

  it('should contain filepath', function(done) {
    parseDir(fixture + 'users.ls', function(err, data) {
      assert(data[0].filepath.indexOf(fixture + 'users.ls') !== -1);
      done();
    });
  });

  it('should contain filename', function(done) {
    parseDir(fixture + 'users.ls', function(err, data) {
      assert(data[0].filename === 'users.ls');
      done();
    });
  });

  it('should contain basename', function(done) {
    parseDir(fixture + 'users.ls', function(err, data) {
      assert(data[0].basename === 'users');
      done();
    });
  });

  it('should contain extension', function(done) {
    parseDir(fixture + 'users.ls', function(err, data) {
      assert(data[0].extension === '.ls');
      done();
    });
  });

  it('should return raw output', function(done) {
    parseDir(fixture + 'users.ls', function(err, data) {
      assert(data[0].raw === fs.readFileSync(fixture + 'users.ls').toString());
      done();
    });
  });

  it.skip('should return parsed output', function(done) {
    parseDir(fixture + 'users.ls', function(err, data) {
      assert(data[0].contents[0].name === 'John');
      done();
    });
  });

  // Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
  it.skip('should handle malformed livescript', function(done) {
    parseDir(fixture + 'malformed.ls', function(err, data) {
      console.log(data);
      assert(!data[0].parsed);
      done();
    });
  });
});
