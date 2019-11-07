module.exports = {
  up: db => {
    return db.run(`INSERT INTO test_table (test) VALUES (?)`, ['hello'])
  },

  down: db => {
    return db.run(`DELETE FROM test_table WHERE test = ?`, ['hello'])
  }
}
