module.exports = {
  up: (db) => {
    return db.run('CREATE TABLE test_table (test TEXT)');
  },

  down: (db) => {
    return db.run('DROP TABLE test_table');
  }
};
