module.exports = async ({ driver, migrations, logger }) => {
  logger = logger || (() => null)

  const driverInstance = await driver()
  if (driverInstance.init) {
    await driverInstance.init('down')
  }

  migrations.reverse()

  for (const migration of migrations) {
    const active = await driverInstance.getMigrationState(migration.id)
    if (active) {
      logger(`Tearing down ${migration.id}`)
      try {
        const passedFunctions = await driverInstance.getPassedFunctions()
        await migration.down(passedFunctions)
        await driverInstance.setMigrationDown(migration.id)
      } catch (error) {
        logger(`Error tearing down ${migration.id}`, error)
      }
    } else {
      logger(`Migration ${migration.id} is not active`)
    }
  }

  if (driverInstance.finish) {
    await driverInstance.finish('down')
  }
}
