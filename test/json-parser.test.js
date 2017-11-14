'use strict';
const parseDir = require('../lib/index');
const test = require('tape');
const fs = require('fs');
const path = require('path');
const fixture = 'test/fixture/json/';

test('json should be parsed', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.json`);
  t.equal(data[0].parsed, true);
});

test('json should contain filepath', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.json`);
  t.equal(data[0].filepath.indexOf(path.join(fixture, 'users.json')) !== -1, true);
});

test('json should contain filename', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.json`);
  t.equal(data[0].filename, 'users.json');
});

test('json should contain basename', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.json`);
  t.equal(data[0].basename, 'users');
});

test('json should contain extension', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.json`);
  t.equal(data[0].extension, '.json');
});

test('json should return raw output', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.json`);
  t.equal(data[0].raw, fs.readFileSync(`${fixture}users.json`).toString());
});

test('json should return parsed output', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.json`);
  t.equal(data[0].contents[0].name, 'John');
});

test('json should handle malformed json', async (t) => {
  t.plan(1);
  try {
    const data = await parseDir(fixture + 'malformed.json');
  } catch (e) {
    t.notEqual(e, null);
  }
});
