module.exports = async ({driver, migrations}) => {
  if (driver.init) {
    await driver.init('up')
  }
  
  for (let migration of migrations) {
    const active = await driver.getMigrationState(migration.id)
    if (active) {
      console.log(`Migration ${migration.id} already active`)
    } else {
      console.log(`Bring up ${migration.id}`)
      try {
        await migration.up(driver.db)
        await driver.setMigrationUp(migration.id)
      } catch (err) {
        console.log(`Error bringing up ${migration.id}`, err)
      }
    }
  }

  if (driver.finish) {
    await driver.finish('up')
  }
}
