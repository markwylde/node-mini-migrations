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
There are two examples, one using sqlite and another using a pretend custom file system database.

1. [SQLite Driver](example/driver.js)
2. [Filesystem Driver](exampleFilesystem/driver.js)


```javascript
const sqlite = require('sqlite')

module.exports = function () {
  let db

  return {
    init: async () => {
      db = await sqlite.open('./test.sqlite')
      await db.run('CREATE TABLE IF NOT EXISTS _migrations (file TEXT PRIMARY KEY);')
    },

    finish: async () => {
      await db.close()
    },

    getMigrationState: async (id) => {
      return db.get('SELECT file FROM _migrations WHERE file = ?', [id])
    },

    setMigrationUp: async (id) => {
      return db.run('INSERT INTO _migrations (file) VALUES (?)', [id])
    },

    setMigrationDown: async (id) => {
      return db.run('DELETE FROM _migrations WHERE file = ?', [id])
    },

    getPassedFunctions: async () => {
      return db
    }
  }
}

```

### Usage
You run `migrator up` to bring up any migrations or `migrator down` to bring them down.

#### Or inside node app
```javascript
const {up, prepareRun} = require('node-mini-migrations')
up(prepareRun('./migrations'))
```

## License
This project is licensed under the terms of the GPLv3 license.
