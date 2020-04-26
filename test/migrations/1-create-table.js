const sqlite = require('sqlite-fp');

module.exports = {
  up: (db, callback) => {
    return sqlite.run(db, 'CREATE TABLE test_table (test TEXT)', callback);
  },

  down: (db, callback) => {
    return sqlite.run(db, 'DROP TABLE test_table', callback);
  }
};
