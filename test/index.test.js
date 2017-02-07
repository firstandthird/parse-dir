'use strict';
const parseDir = require('../lib/index');
const test = require('tape');

test('parse-dir should be a function', (t) => {
  t.plan(1);
  t.equal(typeof parseDir, 'function');
});
test('parse-dir should handle multiple files', (t) => {
  t.plan(2);
  parseDir('test/fixture/**/*', (err, data) => {
    t.equal(err, null);
    t.equal(data.length, 20);
  });
});

test('Should handle synchronous as well', (t) => {
  t.plan(1);
  const result = parseDir.sync('test/fixture/**/*');
  t.equal(result.length > 1, true);
});

test('parse-dir should return relative paths', (t) => {
  t.plan(3);
  parseDir('test/fixture/json/*.json', (err, data) => {
    t.equal(data.length, 2);
    t.equal(data[0].relativePath, 'test/fixture/json/malformed.json');
    t.equal(data[1].relativePath, 'test/fixture/json/users.json');
  });
});

test('parse-dir should return isDirectory', (t) => {
  t.plan(2);
  parseDir('test/fixture/directories/**/*', (err, data) => {
    t.equal(data[0].isDirectory, true);
    t.equal(data[1].isDirectory, false);
  });
});

test('parse-dir should return parsed = false for unknown files', (t) => {
  t.plan(1);
  parseDir('test/fixture/unknown/**/*', (err, data) => {
    t.equal(data[0].parsed, false);
  });
});

test('parse-dir should return raw == contents if not parsed', (t) => {
  t.plan(1);
  parseDir('test/fixture/unknown/**/*', (err, data) => {
    t.equal(data[0].contents, data[0].raw);
  });
});
