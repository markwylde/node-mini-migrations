export async function down (driver, migrations, logger, steps) {
  logger = logger || (() => null);
  steps = steps || 1;

  if (driver.init) {
    await driver.init('down');
  }

  const reversedMigrations = [...migrations].reverse();

  let currentSteps = 0;
  for (const migration of reversedMigrations) {
    currentSteps = currentSteps + 1;

    if (currentSteps > steps) {
      break;
    }

    const active = await driver.getMigrationState(migration.id);

    if (!active) {
      logger(`Migration ${migration.id} skipped (not active)`);
    } else {
      logger(`Bring down ${migration.id}`);

      await driver.handler(migration.down);
      await driver.setMigrationDown(migration.id);
    }
  }

  if (driver.finish) {
    await driver.finish('down');
  }
}

export default down;
