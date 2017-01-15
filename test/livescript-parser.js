'use strict';
const parseDir = require('../lib/parse-dir');
const test = require('tape');
const fs = require('fs');

const fixture = 'test/fixture/livescript/';

test.skip('livescript should be parsed', (t) => {
  t.plan(1);//
  parseDir(`${fixture}users.ls`, (err, data) => {
    t.equal(data[0].parsed);
  });
});

test('livescript should contain filepath', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.ls`, (err, data) => {
    t.equal(data[0].filepath.indexOf(`${fixture}users.ls`) !== -1, true);
  });
});

test('livescript should contain filename', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.ls`, (err, data) => {
    t.equal(data[0].filename, 'users.ls');
  });
});

test('livescript should contain basename', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.ls`, (err, data) => {
    t.equal(data[0].basename, 'users');
  });
});

test('livescript should contain extension', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.ls`, (err, data) => {
    t.equal(data[0].extension, '.ls');
  });
});

test('livescript should return raw output', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.ls`, (err, data) => {
    t.equal(data[0].raw, fs.readFileSync(`${fixture}users.ls`).toString());
  });
});

test.skip('livescript should return parsed output', (t) => {
  t.plan(1);
  parseDir(`${fixture}users.ls`, (err, data) => {
    t.equal(data[0].contents[0].name, 'John');
  });
});

// Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
test.skip('livescript should handle malformed livescript', (t) => {
  t.plan(1);
  parseDir(fixture + 'malformed.ls', (err, data) => {
    t.equal(!data[0].parsed);
  });
});
