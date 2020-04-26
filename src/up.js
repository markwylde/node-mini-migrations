const righto = require('righto');
const rightoSeries = require('righto-series');

function up (driver, migrations, logger, callback) {
  if (arguments.length === 3) {
    callback = logger;
    logger = () => null;
  }

  rightoSeries(function * () {
    if (driver.init) {
      yield righto(driver.init, 'up');
    }

    for (const migration of migrations) {
      const active = yield righto(driver.getMigrationState, migration.id);

      if (active) {
        logger(`Migration ${migration.id} skipped (already active)`);
      } else {
        logger(`Bring up ${migration.id}`);

        yield righto(driver.handler, migration.up);
        yield righto(driver.setMigrationUp, migration.id);
      }
    }

    if (driver.finish) {
      yield righto(driver.finish, 'up');
    }
  }, callback);
}

module.exports = up;
