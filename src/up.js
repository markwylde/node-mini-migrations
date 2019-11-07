module.exports = async ({driver, migrations, logger}) => {
  logger = logger || (() => null)

  const driverInstance = driver()
  if (driverInstance.init) {
    await driverInstance.init('up')
  }
  
  for (let migration of migrations) {
    const active = await driverInstance.getMigrationState(migration.id)
    if (active) {
      logger(`Migration ${migration.id} already active`)
    } else {
      logger(`Bring up ${migration.id}`)
      try {
        const passedFunctions = await driverInstance.getPassedFunctions()
        await migration.up(passedFunctions)
        await driverInstance.setMigrationUp(migration.id)
      } catch (err) {
        logger(`Error bringing up ${migration.id}`, err)
      }
    }
  }

  if (driverInstance.finish) {
    await driverInstance.finish('up')
  }
}
