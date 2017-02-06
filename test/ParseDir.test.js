const ParseDir = require('../lib/ParseDir');
const tape = require('tape');

tape('can construct ParseDir', (assert) => {
  const pd = new ParseDir({});
  assert.equal(pd instanceof ParseDir, true);
  assert.end();
});

tape('ParseDir.sync', (assert) => {
  const pd = new ParseDir({});
  const result = pd.sync('test/fixture/json/users.json');
  console.log('++++++++++++++++++++++++++++++')
  console.log('++++++++++++++++++++++++++++++')
  console.log('++++++++++++++++++++++++++++++')
  console.log('++++++++++++++++++++++++++++++')
  console.log('++++++++++++++++++++++++++++++')
  console.log(result)
  assert.end();
});

tape('ParseDir.handleAsync', (assert) => {
  const pd = new ParseDir({});
  pd.handleAsync('test/fixture/json/users.json', (err, result) => {
    assert.equal(err, null);
    assert.equal(result[0].parsed, true);
    assert.end();
  });
});
