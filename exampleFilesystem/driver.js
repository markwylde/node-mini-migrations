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
