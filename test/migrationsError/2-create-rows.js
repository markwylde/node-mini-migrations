const sqlite = require('sqlite-fp');

module.exports = {
  up: (db, callback) => {
    return sqlite.run(db, 'INSERT INTO test_table (test) VALUES (?)', ['hello'], callback);
  },

  down: (db, callback) => {
    return sqlite.run(db, 'DELETE FROM test_table WHERE test = ?', ['hello'], callback);
  }
};
