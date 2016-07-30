const parseDir = require('../lib/parse-dir');
const assert = require('assert');
const fs = require('fs');

const fixture = 'test/fixture/javascript/';

describe('javascript', () => {
  it('should be parsed', (done) => {
    parseDir(`${fixture}users.js`, (err, data) => {
      assert(data[0].parsed);
      done();
    });
  });

  it('should contain filepath', (done) => {
    parseDir(`${fixture}users.js`, (err, data) => {
      assert(data[0].filepath.indexOf('fixture') !== -1);
      assert(data[0].filepath.indexOf('javascript') !== -1);
      assert(data[0].filepath.indexOf('test') !== -1);
      done();
    });
  });
  it('should contain filename', (done) => {
    parseDir(`${fixture}users.js`, (err, data) => {
      assert(data[0].filename === 'users.js');
      done();
    });
  });

  it('should contain basename', (done) => {
    parseDir(`${fixture}users.js`, (err, data) => {
      assert(data[0].basename === 'users');
      done();
    });
  });

  it('should contain extension', (done) => {
    parseDir(`${fixture}users.js`, (err, data) => {
      assert(data[0].extension === '.js');
      done();
    });
  });

  it('should return raw output', (done) => {
    parseDir(`${fixture}users.js`, (err, data) => {
      assert(data[0].raw === fs.readFileSync(`${fixture}/users.js`).toString());
      done();
    });
  });

  it('should return parsed output', (done) => {
    parseDir(`${fixture}users.js`, (err, data) => {
      assert(data[0].contents[0].name === 'John');
      done();
    });
  });

  // Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
  it.skip('should handle malformed js', (done) => {
    parseDir(`${fixture}malformed.js`, (err, data) => {
      assert(!data[0].parsed);
      done();
    });
  });
});
