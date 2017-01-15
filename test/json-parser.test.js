'use strict';
const parseDir = require('../lib/parse-dir');
const test = require('tape');
const fs = require('fs');

const fixture = 'test/fixture/json/';

test('json should be parsed', (t) => {
  t.plan(1);
  parseDir(fixture + 'users.json', (err, data) => {
    t.equal(data[0].parsed, true);
  });
});

test('json should contain filepath', (t) => {
  t.plan(1);
  parseDir(fixture + 'users.json', (err, data) => {
    t.equal(data[0].filepath.indexOf(fixture + 'users.json') !== -1, true);
  });
});

test('json should contain filename', (t) => {
  t.plan(1);
  parseDir(fixture + 'users.json', (err, data) => {
    t.equal(data[0].filename, 'users.json');
  });
});

test('json should contain basename', (t) => {
  t.plan(1);
  parseDir(fixture + 'users.json', (err, data) => {
    t.equal(data[0].basename, 'users');
  });
});

test('json should contain extension', (t) => {
  t.plan(1);
  parseDir(fixture + 'users.json', (err, data) => {
    t.equal(data[0].extension, '.json');
  });
});

test('json should return raw output', (t) => {
  t.plan(1);
  parseDir(fixture + 'users.json', (err, data) => {
    t.equal(data[0].raw, fs.readFileSync(fixture + 'users.json').toString());
  });
});

test('json should return parsed output', (t) => {
  t.plan(1);
  parseDir(fixture + 'users.json', (err, data) => {
    t.equal(data[0].contents[0].name, 'John');
  });
});

test('json should handle malformed json', (t) => {
  t.plan(1);
  parseDir(fixture + 'malformed.json', (err, data) => {
    t.equal(!data[0].parsed, true);
  });
});
