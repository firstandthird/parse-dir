'use strict';
const ParseDir = require('../lib/ParseDir');
const tape = require('tape');

tape('can construct ParseDir', (assert) => {
  const pd = new ParseDir({});
  assert.equal(pd instanceof ParseDir, true);
  assert.end();
});

tape('ParseDir.handleAsync', async (assert) => {
  const pd = new ParseDir({});
  pd.handleAsync('test/fixture/json/users.json', (err, result) => {
    assert.ok(result[0].relativePath, 'should extract required fields');
    assert.ok(result[0].filepath, 'should extract required fields');
    assert.ok(result[0].filename, 'should extract required fields');
    assert.ok(result[0].basename, 'should extract required fields');
    assert.ok(result[0].extension, 'should extract required fields');
    assert.ok(result[0].parsed, 'should extract required fields');
    assert.ok(result[0].raw, 'should extract required fields');
    assert.equal(result[0].isDirectory, false);
    assert.equal(result[0].contents[0].name, 'John');
    assert.end();
  });
});
