const parseDir = require('../lib/parse-dir');
const assert = require('assert');
const fs = require('fs');
// registers coffeescript with 'require'
require('coffee-script/register');

const fixture = 'test/fixture/coffeescript/';

describe('coffeescript', () => {
  it('should be parsed', (done) => {
    parseDir(`${fixture}users.coffee`, (err, data) => {
      assert(data[0].parsed);
      done();
    });
  });

  it('should contain filepath', (done) => {
    parseDir(`${fixture}users.coffee`, (err, data) => {
      assert(data[0].filepath.indexOf('users.coffee') !== -1);
      assert(data[0].filepath.indexOf('test') !== -1);
      assert(data[0].filepath.indexOf('fixture') !== -1);
      assert(data[0].filepath.indexOf('coffeescript') !== -1);
      done();
    });
  });

  it('should contain filename', (done) => {
    parseDir(`${fixture}users.coffee`, (err, data) => {
      assert(data[0].filename === 'users.coffee');
      done();
    });
  });

  it('should contain basename', (done) => {
    parseDir(`${fixture}users.coffee`, (err, data) => {
      assert(data[0].basename === 'users');
      done();
    });
  });

  it('should contain extension', (done) => {
    parseDir(`${fixture}users.coffee`, (err, data) => {
      assert(data[0].extension === '.coffee');
      done();
    });
  });

  it('should return raw output', (done) => {
    parseDir(`${fixture}users.coffee`, (err, data) => {
      assert(data[0].raw === fs.readFileSync(`${fixture}users.coffee`).toString());
      done();
    });
  });

  it('should return parsed output', (done) => {
    parseDir(`${fixture}users.coffee`, (err, data) => {
      assert(data[0].contents[0].name === 'John');
      done();
    });
  });

  // Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
  it.skip('should handle malformed coffee', (done) => {
    parseDir(`${fixture}malformed.coffee`, (err, data) => {
      assert(!data[0].parsed);
      done();
    });
  });
});
