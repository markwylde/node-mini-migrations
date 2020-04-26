const path = require('path');
const fs = require('fs');

const getMigrationsFromDirectory = (dir) => {
  dir = path.resolve(dir);

  const migrations = fs.readdirSync(dir)
    .filter(file => !['index.js'].includes(file))
    .filter(file => file.endsWith('.js'))
    .map(file => ({ id: file, ...require(path.join(dir, file)) }));

  return migrations;
};

module.exports = getMigrationsFromDirectory;
