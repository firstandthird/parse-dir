'use strict';
const parseDir = require('../lib/index');
const test = require('tape');

test('parse-dir should be a function', (t) => {
  t.plan(1);
  t.equal(typeof parseDir, 'function');
});

test('parse-dir should handle one file', (t) => {
  parseDir('test/fixture/javascript/users.js', (err, data) => {
    t.equal(err, null);
    t.equal(data.length, 1);
    t.equal(data[0].parsed, true);
    t.end();
  });
});

test('parse-dir should handle multiple files', (t) => {
  t.plan(2);
  parseDir('test/fixture/multiple/*', (err, data) => {
    t.equal(err, null);
    t.equal(data.length, 4);
  });
});

test('parse-dir should exit with err if any file cannot be parsed', (t) => {
  parseDir('test/fixture/**/*', (err, data) => {
    t.notEqual(err, null);
    t.end();
  });
});

test('parse-dir should return relative paths', (t) => {
  t.plan(2);
  parseDir('test/fixture/json/users.json', (err, data) => {
    t.equal(data.length, 1);
    t.equal(data[0].relativePath, 'test/fixture/json/users.json');
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
