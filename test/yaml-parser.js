const parseDir = require('../lib/parse-dir');
const assert = require('assert');
const fs = require('fs');

const fixture = 'test/fixture/yaml/';
describe('yaml', () => {
  it('should be parsed', (done) => {
    parseDir(`${fixture}users.yaml`, (err, data) => {
      assert(data[0].parsed);
      done();
    });
  });

  it('should contain filepath', (done) => {
    parseDir(`${fixture}users.yaml`, (err, data) => {
      assert(data[0].filepath.indexOf('users.yaml') !== -1);
      assert(data[0].filepath.indexOf('test') !== -1);
      assert(data[0].filepath.indexOf('fixture') !== -1);
      assert(data[0].filepath.indexOf('yaml') !== -1);
      done();
    });
  });

  it('should contain filename', (done) => {
    parseDir(`${fixture}users.yaml`, (err, data) => {
      assert(data[0].filename === 'users.yaml');
      done();
    });
  });

  it('should contain basename', (done) => {
    parseDir(`${fixture}users.yaml`, (err, data) => {
      assert(data[0].basename === 'users');
      done();
    });
  });

  it('should contain extension', (done) => {
    parseDir(`${fixture}users.yaml`, (err, data) => {
      assert(data[0].extension === '.yaml');
      done();
    });
  });

  it('should return raw output', (done) => {
    parseDir(`${fixture}users.yaml`, (err, data) => {
      assert(data[0].raw === fs.readFileSync(`${fixture}users.yaml`).toString());
      done();
    });
  });

  it('should return parsed output', (done) => {
    parseDir(`${fixture}users.yaml`, (err, data) => {
      assert(data[0].contents[0].name === 'John');
      done();
    });
  });

  it('should handle malformed yaml', (done) => {
    parseDir(`${fixture}malformed.yaml`, (err, data) => {
      assert(!data[0].parsed);
      done();
    });
  });
});
