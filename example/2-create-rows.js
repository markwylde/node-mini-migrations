module.exports = {
  up: db => {
    return db.insert('test_table', {id: 1})
  },

  down: db => {
    return db.remove('test_table', {id: 1})
  }
}
