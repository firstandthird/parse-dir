'use strict';
const parseDir = require('../lib/parse-dir');
const test = require('tape');
const fs = require('fs');

const fixture = 'test/fixture/javascript/';

test('javascript should be parsed', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.js`, (err, data) => {
    t.equal(data[0].parsed, true);
  });
});

test('javascript should contain filepath', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.js`, (err, data) => {
    t.equal(data[0].filepath.indexOf(`${fixture}users.js`) !== -1, true);
  });
});

test('javascript should contain filename', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.js`, (err, data) => {
    t.equal(data[0].filename, 'users.js');
  });
});

test('javascript should contain basename', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.js`, (err, data) => {
    t.equal(data[0].basename, 'users');
  });
});
test('javascript should contain extension', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.js`, (err, data) => {
    t.equal(data[0].extension, '.js');
  });
});
test('javascript should return raw output', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.js`, (err, data) => {
    t.equal(data[0].raw, fs.readFileSync(`${fixture}users.js`).toString());
  });
});
test('javascript should return parsed output', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.js`, (err, data) => {
    t.equal(data[0].contents[0].name, 'John');
  });
});
// Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
test.skip('javascript should handle malformed js', (t) => {
  parseDir(fixture + 'malformed.js', (err, data) => {
    t.equal(!data[0].parsed);
    done();
  });
});
