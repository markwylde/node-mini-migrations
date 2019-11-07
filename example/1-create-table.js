module.exports = {
  up: db => {
    return db.tableCreate('test_table')
  },

  down: db => {
    return db.tableDrop('test_table')
  }
}
