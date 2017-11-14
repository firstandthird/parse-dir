'use strict';
const parseDir = require('../lib/index');
const test = require('tape');

test('parse-dir should be a function', async (t) => {
  t.plan(1);
  t.equal(typeof parseDir, 'function');
});

test('parse-dir should handle one file', async (t) => {
  const data = await parseDir('test/fixture/javascript/users.js');
  t.equal(data.length, 1);
  t.equal(data[0].parsed, true);
  t.end();
});

test('parse-dir should handle multiple files', async (t) => {
  const data = await parseDir('test/fixture/multiple/*');
  t.equal(data.length, 4);
  t.end();
});

test('parse-dir should exit with err if any file cannot be parsed', async (t) => {
  try {
    const data = await parseDir('test/fixture/**/*');
  } catch (e) {
    t.notEqual(e, null);
    t.end();
  }
});

test('parse-dir should return relative paths', async (t) => {
  t.plan(2);
  const data = await parseDir('test/fixture/json/users.json');
  t.equal(data.length, 1);
  t.equal(data[0].relativePath, 'test/fixture/json/users.json');
});

test('parse-dir should return isDirectory', async (t) => {
  t.plan(2);
  const data = await parseDir('test/fixture/directories/**/*');
  t.equal(data[0].isDirectory, true);
  t.equal(data[1].isDirectory, false);
});

test('parse-dir should return parsed = false for unknown files', async (t) => {
  t.plan(1);
  const data = await parseDir('test/fixture/unknown/**/*');
  t.equal(data[0].parsed, false);
});

test('parse-dir should return raw == contents if not parsed', async (t) => {
  t.plan(1);
  const data = await parseDir('test/fixture/unknown/**/*');
  t.equal(data[0].contents, data[0].raw);
});
