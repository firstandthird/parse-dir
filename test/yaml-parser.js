'use strict';
const parseDir = require('../lib/index');
const test = require('tape');
const fs = require('fs');

const fixture = 'test/fixture/yaml/';

test('yaml should be parsed', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.yaml`, (err, data) => {
    t.equal(data[0].parsed, true);
  });
});

test('yaml should contain filepath', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.yaml`, (err, data) => {
    t.equal(data[0].filepath.indexOf(`${fixture}users.yaml`) !== -1, true);
  });
});

test('yaml should contain filename', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.yaml`, (err, data) => {
    t.equal(data[0].filename, 'users.yaml');
  });
});

test('yaml should contain basename', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.yaml`, (err, data) => {
    t.equal(data[0].basename, 'users');
  });
});

test('yaml should contain extension', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.yaml`, (err, data) => {
    t.equal(data[0].extension, '.yaml');
  });
});

test('yaml should return raw output', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.yaml`, (err, data) => {
    t.equal(data[0].raw, fs.readFileSync(`${fixture}users.yaml`).toString());
  });
});

test('yaml should return parsed output', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.yaml`, (err, data) => {
    t.equal(data[0].contents[0].name, 'John');
  });
});

test('yaml should handle malformed yaml', (t) => {
  t.plan(1);
  parseDir(`${fixture}malformed.yaml`, (err, data) => {
    t.equal(!data[0].parsed, true);
  });
});
