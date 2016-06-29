const parseDir = require('../lib/parse-dir');
const assert = require('assert');
const fs = require('fs');

const fixture = 'test/fixture/livescript/';
describe('livescript', () => {
  it.skip('should be parsed', (done) => {
    parseDir(`${fixture}users.ls`, (err, data) => {
      assert(data[0].parsed);
      done();
    });
  });

  it('should contain filepath', (done) => {
    parseDir(`${fixture}users.ls`, (err, data) => {
      assert(data[0].filepath.indexOf('users.ls') !== -1);
      assert(data[0].filepath.indexOf('test') !== -1);
      assert(data[0].filepath.indexOf('fixture') !== -1);
      assert(data[0].filepath.indexOf('livescript') !== -1);
      done();
    });
  });

  it('should contain filename', (done) => {
    parseDir(`${fixture}users.ls`, (err, data) => {
      assert(data[0].filename === 'users.ls');
      done();
    });
  });

  it('should contain basename', (done) => {
    parseDir(`${fixture}users.ls`, (err, data) => {
      assert(data[0].basename === 'users');
      done();
    });
  });

  it('should contain extension', (done) => {
    parseDir(`${fixture}users.ls`, (err, data) => {
      assert(data[0].extension === '.ls');
      done();
    });
  });

  it('should return raw output', (done) => {
    parseDir(`${fixture}users.ls`, (err, data) => {
      assert(data[0].raw === fs.readFileSync(`${fixture}users.ls`).toString());
      done();
    });
  });

  it.skip('should return parsed output', (done) => {
    parseDir(`${fixture}users.ls`, (err, data) => {
      assert(data[0].contents[0].name === 'John');
      done();
    });
  });

  // Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
  it.skip('should handle malformed livescript', (done) => {
    parseDir(`${fixture}malformed.ls`, (err, data) => {
      assert(!data[0].parsed);
      done();
    });
  });
});
