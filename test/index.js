import fs from 'fs';
import test from 'basictap';
import sqlite from 'sqlite-fp/promises.js';

import migrator from './migrations/index.js';

import { getMigrationsFromDirectory, down, up } from '../index.js';

function clean () {
  if (fs.existsSync('./test.sqlite')) {
    fs.unlinkSync('./test.sqlite');
  }
}

test('migrate examples up', async function (t) {
  t.plan(2);

  clean();

  const db = await sqlite.connect('./test.sqlite');
  const driver = migrator(db);
  const migrations = await getMigrationsFromDirectory('./test/migrations');
  await up(driver, migrations, null);

  t.ok(fs.existsSync('./test.sqlite'));
  const result = await sqlite.getOne(db, 'SELECT * FROM test_table');
  t.equal(result.test, 'hello');

  await db.close();
});

test('migrate examples up, down', async function (t) {
  t.plan(2);

  clean();

  const db = await sqlite.connect('./test.sqlite');
  const driver = migrator(db);
  const migrations = await getMigrationsFromDirectory('./test/migrations');
  await up(driver, migrations, null);
  await down(driver, migrations, null, 1);

  t.ok(fs.existsSync('./test.sqlite'));
  const result = await sqlite.getOne(db, 'SELECT * FROM test_table');
  t.notOk(result);

  await db.close();
});

test('migrate examples up, down, up', async function (t) {
  t.plan(2);

  clean();

  const db = await sqlite.connect('./test.sqlite');
  const driver = migrator(db);
  const migrations = await getMigrationsFromDirectory('./test/migrations');
  await up(driver, migrations, null);
  await down(driver, migrations, null, 1);
  await up(driver, migrations, null);

  t.ok(fs.existsSync('./test.sqlite'));
  const result = await sqlite.getOne(db, 'SELECT * FROM test_table');
  t.equal(result.test, 'hello');

  await db.close();
});

test('migrate examples up with error', async function (t) {
  t.plan(1);

  clean();

  const db = await sqlite.connect('./test.sqlite');
  try {
    const driver = migrator(db);
    const migrations = await getMigrationsFromDirectory('./test/migrationsError');
    await up(driver, migrations, null);
  } catch (error) {
    t.ok(error.message.includes('syntax error'));

    await db.close();
  }
});

test('migrate examples up with no init or finish', async function (t) {
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
  await up(driver, []);

  t.pass();
});
