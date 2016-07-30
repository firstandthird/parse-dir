const parseDir = require('../lib/parse-dir');
const assert = require('assert');

describe('parse-dir', () => {

  it('should be a function', () => {
    assert(typeof parseDir === 'function');
  });

  // it('should handle multiple files', (done) => {
  //   parseDir('test/fixture/**/*', (err, data) => {
  //     assert(data.length > 1);
  //     done();
  //   });
  // });

  it('Should handle synchronous as well', () => {
    const result = parseDir.sync('test/fixture/**/*');
    assert(result.length > 1);
  });

  // it('should return relative paths', (done) => {
  //   parseDir('test/fixture/json/*.json', (err, data) => {
  //     assert.equal(data.length, 2);
  //     assert(data[0].relativePath, 'test/fixture/json/malformed.json');
  //     assert(data[1].relativePath, 'test/fixture/json/users.json');
  //     done();
  //   });
  // });
  //
  // describe('directories', () => {
  //   it('should return isDirectory', (done) => {
  //     parseDir('test/fixture/directories/**/*', (err, data) => {
  //       assert(data[0].isDirectory);
  //       assert.equal(data[1].isDirectory, false);
  //       done();
  //     });
  //   });
  // });
  //
  // describe('unknown files', () => {
  //   it('should return parsed = false for unknown files', (done) => {
  //     parseDir('test/fixture/unknown/**/*', (err, data) => {
  //       assert.equal(data[0].parsed, false);
  //       done();
  //     });
  //   });
  //
  //   it('should return raw == contents if not parsed', (done) => {
  //     parseDir('test/fixture/unknown/**/*', (err, data) => {
  //       assert.equal(data[0].contents, data[0].raw);
  //       done();
  //     });
  //   });
  // });
});
