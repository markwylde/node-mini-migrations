import path from 'path';
import fs from 'fs';

export const getMigrationsFromDirectory = (dir) => {
  dir = path.resolve(dir);

  const migrations = Promise.all(
    fs.readdirSync(dir)
      .filter(file => !['index.js'].includes(file))
      .filter(file => file.endsWith('.js'))
      .map(async file => ({ id: file, ...await import(path.join(dir, file)) }))
  );

  return migrations;
};

export default getMigrationsFromDirectory;
