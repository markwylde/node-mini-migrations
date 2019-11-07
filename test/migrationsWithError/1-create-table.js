module.exports = {
  up: db => {
    return db.exec('CREATE_WHOOPS TABLE test_table (test TEXT)')
  },

  down: db => {
    return db.exec('DROP TABLE test_table')
  }
}
