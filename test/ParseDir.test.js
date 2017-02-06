const ParseDir = require('../lib/ParseDir');
const tape = require('tape');

tape('can construct ParseDir', (assert) => {
  const pd = new ParseDir({});
  assert.equal(pd instanceof ParseDir, true);
  assert.end();
});

tape('ParseDir.sync', (assert) => {
  const pd = new ParseDir({ async: false });
  const result = pd.sync('test/fixture/json/users.json');
  assert.ok(result[0].relativePath);
  assert.ok(result[0].filepath);
  assert.ok(result[0].filename);
  assert.ok(result[0].basename);
  assert.ok(result[0].extension);
  assert.ok(result[0].parsed);
  assert.ok(result[0].raw);
  assert.equal(result[0].isDirectory, false);
  assert.equal(result[0].contents[0].name, 'John');
  assert.end();
});

tape('ParseDir.handleAsync', (assert) => {
  const pd = new ParseDir({});
  pd.handleAsync('test/fixture/json/users.json', (err, result) => {
    assert.equal(err, null);
    assert.ok(result[0].relativePath);
    assert.ok(result[0].filepath);
    assert.ok(result[0].filename);
    assert.ok(result[0].basename);
    assert.ok(result[0].extension);
    assert.ok(result[0].parsed);
    assert.ok(result[0].raw);
    assert.equal(result[0].isDirectory, false);
    assert.equal(result[0].contents[0].name, 'John');
    assert.end();
  });
});
