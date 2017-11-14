'use strict';
const FileProcessor = require('../lib/FileProcessor');
const tape = require('tape');
const fs = require('fs');

tape('can construct FileProcessor', async (assert) => {
  const fp = new FileProcessor({});
  assert.equal(fp instanceof FileProcessor, true);
  assert.end();
});

tape('FileProcessor.determineIfDirectory async', async (assert) => {
  const fp = new FileProcessor({});
  const result = await fp.determineIfDirectory({ filepath: 'test' });
  assert.equal(result, true, 'detects when a dir');
  const result2 = await fp.determineIfDirectory({ filepath: 'test/FileProcessor.test.js'});
  assert.equal(result2, false, 'determines when not a director');
  assert.end();
});

tape('FileProcessor.getFileContents async', async (assert) => {
  const fp = new FileProcessor({});
  assert.equal(typeof fp.getFileContents, 'function');
  const result = await fp.getFileContents({ filepath: 'test/FileProcessor.test.js' }, false);
  assert.equal(typeof result, 'string', 'returns a string');
  assert.notEqual(result.indexOf("tape('FileProcessor.getFileContents'"), -1, 'returns contents of file as a string');
  assert.end();
});

tape('FileProcessor.parseFileContents', async (assert) => {
  const fp = new FileProcessor({});
  const json = fs.readFileSync('test/fixture/json/users.json').toString();
  const result = await fp.parseFileContents({ extension: '.json' }, json);
  assert.equal(typeof result, 'object', 'returns a parsed object');
  assert.equal(result.length, 1, 'parses json');
  assert.equal(result[0].name, 'John', 'parses json');
  assert.end();
});

tape('FileProcessor.processFile', async (assert) => {
  const fp = new FileProcessor({});
  assert.equal(typeof fp.processFile, 'function');
  const data = await fp.processFile('test/fixture/directories/subdir/file.json');
  assert.ok(fp.data[0].relativePath);
  assert.ok(fp.data[0].filepath);
  assert.ok(fp.data[0].filename);
  assert.ok(fp.data[0].basename);
  assert.ok(fp.data[0].extension);
  assert.ok(fp.data[0].raw);
  assert.equal(fp.data[0].isDirectory, false);
  assert.equal(fp.data.length, 1);
  assert.equal(typeof fp.data[0].contents, 'object');
  assert.equal(fp.data[0].contents.test, 123);
  assert.end();
});
