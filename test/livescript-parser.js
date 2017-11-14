'use strict';
const parseDir = require('../lib/index');
const test = require('tape');
const fs = require('fs');

const fixture = 'test/fixture/livescript/';

test.skip('livescript should be parsed', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.ls`);
  t.equal(data[0].parsed);
});

test('livescript should contain filepath', async (t) => {
  t.plan(1);
  try {
    const data = await parseDir(`${fixture}users.ls`);
  } catch (e) {
    t.equal(data[0].filepath.indexOf(`${fixture}users.ls`) !== -1, true);
  }
});

test('livescript should contain filename', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.ls`);
  t.equal(data[0].filename, 'users.ls');
});

test('livescript should contain basename', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.ls`);
  t.equal(data[0].basename, 'users');
});

test('livescript should contain extension', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.ls`);
  t.equal(data[0].extension, '.ls');
});

test('livescript should return raw output', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.ls`);
  t.equal(data[0].raw, fs.readFileSync(`${fixture}users.ls`).toString());
});

test.skip('livescript should return parsed output', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.ls`);
  t.equal(data[0].contents[0].name, 'John');
});

// Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
test.skip('livescript should handle malformed livescript', async (t) => {
  t.plan(1);
  try {
    parseDir(fixture + 'malformed.ls');
  } catch (e) {
    t.notEqual(e, null);
  }
});
