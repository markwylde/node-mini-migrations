const sqlite = require('sqlite-fp');

module.exports = function (db) {
  return {
    init: (direction, callback) => {
      sqlite.run(db, 'CREATE TABLE IF NOT EXISTS _migrations (file TEXT PRIMARY KEY);', callback);
    },

    finish: (direction, callback) => {
      // sqlite.close(db, callback);
      callback();
    },

    getMigrationState: (id, callback) => {
      sqlite.get(db, 'SELECT file FROM _migrations WHERE file = ?', [id], (error, result) => {
        callback(error, (result && result.length > 0));
      });
    },

    setMigrationUp: (id, callback) => {
      sqlite.run(db, 'INSERT INTO _migrations (file) VALUES (?)', [id], callback);
    },

    setMigrationDown: (id, callback) => {
      sqlite.run(db, 'DELETE FROM _migrations WHERE file = ?', [id], callback);
    },

    handler: (fn, callback) => fn(db, callback)
  };
};
