async function up (driver, migrations, logger) {
  logger = logger || (() => null);

  if (driver.init) {
    await driver.init('up');
  }

  for (const migration of migrations) {
    const active = await driver.getMigrationState(migration.id);

    if (active) {
      logger(`Migration ${migration.id} skipped (already active)`);
    } else {
      logger(`Bring up ${migration.id}`);

      await driver.handler(migration.up);
      await driver.setMigrationUp(migration.id);
    }
  }

  if (driver.finish) {
    await driver.finish('up');
  }
}

module.exports = up;
