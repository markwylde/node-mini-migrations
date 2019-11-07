# Mini Migrations for NodeJS
[![Build Status](https://travis-ci.org/markwylde/node-mini-migrations.svg?branch=master)](https://travis-ci.org/markwylde/node-mini-migrations)
[![David DM](https://david-dm.org/markwylde/node-mini-migrations.svg)](https://david-dm.org/markwylde/node-mini-migrations)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/node-mini-migrations)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/node-mini-migrations)](https://github.com/markwylde/node-mini-migrations/releases)
[![GitHub](https://img.shields.io/github/license/markwylde/node-mini-migrations)](https://github.com/markwylde/node-mini-migrations/blob/master/LICENSE)

A really simple node migrations library that is completely independant of any database or file system.

## Example Usage
You need to define a driver for example:

### Installation
```bash
npm install node-mini-migrations
```

### Setup
```javascript
# migrations/driver.js
const fs = require('fs')

// `passedFunctions` are passed to each migration file and can container
// a database, like mysql, postgres, mongodb, or anything you want. 
// It just returns an object that gets passed to migrations.
const passedFunctions = {
  tableCreate: (table) => {
    console.log('would create a table', table)
  },

  tableDrop: (table) => {
    console.log('would drop a table', table)
  },

  insert: (row) => {
    console.log('would insert a row', row)
  },

  remove: (row) => {
    console.log('would remove a row', row)
  }
}

module.exports = {
  init: () => {
    if (!fs.existsSync('test_state.json')) {
      fs.writeFileSync('test_state.json', JSON.stringify({}))
    }
  },

  finish: () => {
    console.log('finished migrations')
  },

  getMigrationState: (id) => {
    const state = JSON.parse(
      fs.readFileSync('test_state.json', 'utf8')
    )
    return state[id]
  },

  setMigrationUp: (id) => {
    const state = JSON.parse(
      fs.readFileSync('test_state.json', 'utf8')
    )
    state[id] = true
    fs.writeFileSync('test_state.json', JSON.stringify(state))
  },

  setMigrationDown: (id) => {
    const state = JSON.parse(
      fs.readFileSync('test_state.json', 'utf8')
    )
    delete state[id]
    fs.writeFileSync('test_state.json', JSON.stringify(state))
  },

  getPassedFunctions: () => passedFunctions
}

```
### Migration files
You can then create typical migrations files like:

```javascript
# migrations/1-my-migration-example.js
module.exports = {
  up: db => {
    return db.tableCreate('test_table')
  },

  down: db => {
    return db.tableDrop('test_table')
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
