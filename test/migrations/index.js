const sqlite = require('sqlite-fp/promises');

module.exports = function (db) {
  const monad = {
    run: (...args) => sqlite.run(db, ...args),
    getAll: (...args) => sqlite.getAll(db, ...args),
    getOne: (...args) => sqlite.getOne(db, ...args)
  };

  return {
    init: (direction) => {
      return sqlite.run(db, 'CREATE TABLE IF NOT EXISTS _migrations (file TEXT PRIMARY KEY);');
    },

    getMigrationState: (id) => {
      return sqlite.getOne(db, 'SELECT file FROM _migrations WHERE file = ?', [id]);
    },

    setMigrationUp: (id) => {
      return sqlite.run(db, 'INSERT INTO _migrations (file) VALUES (?)', [id]);
    },

    setMigrationDown: (id) => {
      return sqlite.run(db, 'DELETE FROM _migrations WHERE file = ?', [id]);
    },

    handler: (fn) => fn(monad)
  };
};
