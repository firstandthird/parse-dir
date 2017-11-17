'use strict';
const parseDir = require('../lib/index');
const test = require('tape');
const fs = require('fs');

const fixture = 'test/fixture/javascript/';

test('javascript should be parsed', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.js`);
  t.equal(data[0].parsed, true);
});

test('javascript should contain filepath', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.js`);
  t.equal(data[0].filepath.indexOf(`${fixture}users.js`) !== -1, true);
});

test('javascript should contain filename', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.js`);
  t.equal(data[0].filename, 'users.js');
});

test('javascript should contain basename', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.js`);
  t.equal(data[0].basename, 'users');
});

test('javascript should contain extension', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.js`);
  t.equal(data[0].extension, '.js');
});
test('javascript should return raw output', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.js`);
  t.equal(data[0].raw, fs.readFileSync(`${fixture}users.js`).toString());
});
test('javascript should return parsed output', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.js`);
  t.equal(data[0].contents[0].name, 'John');
});
// Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
test.skip('javascript should handle malformed js', async (t) => {
  parseDir(fixture + 'malformed.js');
  t.equal(!data[0].parsed);
});
