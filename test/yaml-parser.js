'use strict';
const parseDir = require('../lib/index');
const test = require('tape');
const fs = require('fs');

const fixture = 'test/fixture/yaml/';

test('yaml should be parsed', async(t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.yaml`);
  t.equal(data[0].parsed, true);
});

test('yaml should contain filepath', async(t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.yaml`);
  t.equal(data[0].filepath.indexOf(`${fixture}users.yaml`) !== -1, true);
});

test('yaml should contain filename', async(t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.yaml`);
  t.equal(data[0].filename, 'users.yaml');
});

test('yaml should contain basename', async(t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.yaml`);
  t.equal(data[0].basename, 'users');
});

test('yaml should contain extension', async(t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.yaml`);
  t.equal(data[0].extension, '.yaml');
});

test('yaml should return raw output', async(t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.yaml`);
  t.equal(data[0].raw, fs.readFileSync(`${fixture}users.yaml`).toString());
});

test('yaml should return parsed output', async(t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.yaml`);
  t.equal(data[0].contents[0].name, 'John');
});

test('yaml should handle malformed yaml', async(t) => {
  t.plan(1);
  try {
    const data = await parseDir(`${fixture}malformed.yaml`);
  } catch (e) {
    t.notEqual(e, null);
  }
});
