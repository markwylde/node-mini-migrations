# Mini Migrations for NodeJS
A really simple node migrations library that is completely independent of any database or file system.

## Installation
```bash
npm install --save node-mini-migrations
```

## Example Usage
### driver
```javascript
import sqlite from 'sqlite-fp/promises.js';
import up from 'node-mini-migrations/up.js';
import getMigrationsFromDirectory from 'node-mini-migrations/getMigrationsFromDirectory.js';

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
export function up (db) {
  return db.exec('CREATE TABLE test_table (test TEXT)')
}

export function down (db) {
  return db.exec('DROP TABLE test_table')
}
```

## License
This project is licensed under the terms of the MIT license.
