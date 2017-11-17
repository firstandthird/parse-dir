'use strict';
const parseDir = require('../lib/index');
const test = require('tape');
const fs = require('fs');
const path = require('path');

// registers coffeescript with 'require'
require('coffee-script/register');

const fixture = 'test/fixture/coffeescript/';

test('coffeescript should be parsed', async(t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.coffee`);
  t.equal(data[0].parsed, true);
});

test('coffeescript should contain filepath', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.coffee`);
  t.equal(data[0].filepath.indexOf(path.join(fixture, 'users.coffee')) !== -1, true);
});

test('coffeescript should contain filename', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.coffee`);
  t.equal(data[0].filename,'users.coffee');
});

test('coffeescript should contain basename', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.coffee`);
  t.equal(data[0].basename,'users');
});

test('coffeescript should return parsed output', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.coffee`);
  t.equal(data[0].contents[0].name, 'John');
});


// Need to figure out a way to test this. Broken JS will just break everything and require just loads an empty object.
test.skip('coffeescript should handle malformed coffee', async (t) => {
  parseDir(fixture + 'malformed.coffee');
  t.equal(!data[0].parsed);
});

test('coffeescript should return raw output', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.coffee`);
  t.equal(data[0].raw, fs.readFileSync(`${fixture}users.coffee`).toString());
});

test('coffeescript should contain extension', async (t) => {
  t.plan(1);
  const data = await parseDir(`${fixture}users.coffee`);
  t.equal(data[0].extension, '.coffee');
});
