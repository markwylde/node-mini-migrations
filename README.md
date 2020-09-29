# Mini Migrations for NodeJS
[![Build Status](https://travis-ci.org/markwylde/node-mini-migrations.svg?branch=master)](https://travis-ci.org/markwylde/node-mini-migrations)
[![David DM](https://david-dm.org/markwylde/node-mini-migrations.svg)](https://david-dm.org/markwylde/node-mini-migrations)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/node-mini-migrations)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/node-mini-migrations)](https://github.com/markwylde/node-mini-migrations/releases)
[![GitHub](https://img.shields.io/github/license/markwylde/node-mini-migrations)](https://github.com/markwylde/node-mini-migrations/blob/master/LICENSE)

A really simple node migrations library that is completely independant of any database or file system.

## Installation
```bash
npm install --save node-mini-migrations
```

## Example Usage
### driver
```javascript
const sqlite = require('sqlite-fp/promises');
const up = require('node-mini-migrations/up');
const getMigrationsFromDirectory = require('node-mini-migrations/getMigrationsFromDirectory');

function migrator (db) {
  return {
    init: (direction) => {
      return sqlite.run(db, 'CREATE TABLE IF NOT EXISTS _migrations (file TEXT PRIMARY KEY);');
    },

    getMigrationState: (id) => {
      return sqlite.getOne(db, 'SELECT file FROM _migrations WHERE file = ?', [id]);
    },

    setMigrationUp: (id) => {
      return sqlite.run(db, 'INSERT INTO _migrations (file) VALUES (?)', [id]);
    },

    setMigrationDown: (id) => {
      return sqlite.run(db, 'DELETE FROM _migrations WHERE file = ?', [id]);
    },

    handler: (fn) => fn(db)
  };
};

const db = await sqlite.connect('./test.sqlite');
await up(
  migrator(db),
  getMigrationsFromDirectory('./test/migrations')
);
```

### migration
```javascript
module.exports = {
  up: (db) => {
    return db.exec('CREATE TABLE test_table (test TEXT)')
  },

  down: (db) => {
    return db.exec('DROP TABLE test_table')
  }
}
```

## License
This project is licensed under the terms of the MIT license.
