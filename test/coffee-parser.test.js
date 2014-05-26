var parseDir = require('../lib/parse-dir');
var assert = require('assert');
var fs = require('fs');

var fixture = 'test/fixture/coffeescript/';

describe('coffeescript', function() {
  it('should be parsed', function(done) {
    parseDir(fixture + 'users.coffee', function(err, data) {
      assert(data[0].parsed);
      done();
    });
  });

  it('should contain filepath', function(done) {
    parseDir(fixture + 'users.coffee', function(err, data) {
      assert(data[0].filepath.indexOf(fixture + 'users.coffee') !== -1);
      done();
    });
  });

  it('should contain filename', function(done) {
    parseDir(fixture + 'users.coffee', function(err, data) {
      assert(data[0].filename === 'users.coffee');
      done();
    });
  });

  it('should contain basename', function(done) {
    parseDir(fixture + 'users.coffee', function(err, data) {
      assert(data[0].basename === 'users');
      done();
    });
  });

  it('should contain extension', function(done) {
    parseDir(fixture + 'users.coffee', function(err, data) {
      assert(data[0].extension === '.coffee');
      done();
    });
  });

  it('should return raw output', function(done) {
    parseDir(fixture + 'users.coffee', function(err, data) {
      assert(data[0].raw === fs.readFileSync(fixture + 'users.coffee').toString());
      done();
    });
  });

  it('should return parsed output', function(done) {
    parseDir(fixture + 'users.coffee', function(err, data) {
      assert(data[0].contents[0].name === 'John');
      done();
    });
  });

  // Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
  it.skip('should handle malformed coffee', function(done) {
    parseDir(fixture + 'malformed.coffee', function(err, data) {
      console.log(data);
      assert(!data[0].parsed);
      done();
    });
  });
});
