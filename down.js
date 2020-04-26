const righto = require('righto');
const rightoSeries = require('righto-series');

function down (driver, migrations, logger, steps, callback) {
  if (arguments.length === 4) {
    callback = steps;
    steps = logger;
    logger = () => null;
  }

  rightoSeries(function * () {
    if (driver.init) {
      yield righto(driver.init, 'down');
    }

    const reversedMigrations = [...migrations].reverse();

    let currentSteps = 0;
    for (const migration of reversedMigrations) {
      currentSteps = currentSteps + 1;

      if (currentSteps > steps) {
        break;
      }

      const active = yield righto(driver.getMigrationState, migration.id);

      if (!active) {
        logger(`Migration ${migration.id} skipped (not active)`);
      } else {
        logger(`Bring down ${migration.id}`);

        yield righto(driver.handler, migration.down);
        yield righto(driver.setMigrationDown, migration.id);
      }
    }

    if (driver.finish) {
      yield righto(driver.finish, 'down');
    }
  }, callback);
}

module.exports = down;
