const fs = require('fs');
const test = require('righto-tape');
const sqlite = require('sqlite-fp');
const righto = require('righto');
const migrator = require('./migrations');

const { getMigrationsFromDirectory, down, up } = require('../');

function clean () {
  if (fs.existsSync('./test.sqlite')) {
    fs.unlinkSync('./test.sqlite');
  }
}

test('migrate examples up', function * (t) {
  t.plan(2);

  clean();

  const db = yield righto(sqlite.connect, './test.sqlite');
  const driver = yield righto.sync(migrator, db);
  const migrations = getMigrationsFromDirectory('./test/migrations');
  yield righto(up, driver, migrations);

  t.ok(fs.existsSync('./test.sqlite'));
  const result = yield righto(sqlite.getOne, db, 'SELECT * FROM test_table');
  t.equal(result.test, 'hello');

  yield righto(sqlite.close, db);
});

test('migrate examples up, down', function * (t) {
  t.plan(2);

  clean();

  const db = yield righto(sqlite.connect, './test.sqlite');
  const driver = yield righto.sync(migrator, db);
  const migrations = getMigrationsFromDirectory('./test/migrations');
  yield righto(up, driver, migrations);
  yield righto(down, driver, migrations, 1);

  t.ok(fs.existsSync('./test.sqlite'));
  const result = yield righto(sqlite.getOne, db, 'SELECT * FROM test_table');
  t.notOk(result);

  yield righto(sqlite.close, db);
});

test('migrate examples up, down, up', function * (t) {
  t.plan(2);

  clean();

  const db = yield righto(sqlite.connect, './test.sqlite');
  const driver = yield righto.sync(migrator, db);
  const migrations = getMigrationsFromDirectory('./test/migrations');
  yield righto(up, driver, migrations);
  yield righto(down, driver, migrations, 1);
  yield righto(up, driver, migrations);

  t.ok(fs.existsSync('./test.sqlite'));
  const result = yield righto(sqlite.getOne, db, 'SELECT * FROM test_table');
  t.equal(result.test, 'hello');

  yield righto(sqlite.close, db);
});

test('migrate examples up with error', function * (t) {
  t.plan(1);

  clean();

  const db = yield righto(sqlite.connect, './test.sqlite');
  const driver = yield righto.sync(migrator, db);
  const migrations = getMigrationsFromDirectory('./test/migrationsError');
  const upped = righto(up, driver, migrations);

  yield righto.handle(upped, function (error, callback) {
    t.ok(error.message.includes('syntax error'));

    sqlite.close(db, callback);
  });
});

test('migrate examples up with no init or finish', function * (t) {
  t.plan(1);

  clean();

  const migrator = function () {
    return {
      getMigrationState: (id, callback) => {
        callback(null, true);
      }
    };
  };

  const driver = migrator();
  up(driver, [], function (error, result) {
    t.notOk(error);
  });
});
