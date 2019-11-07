module.exports = async ({driver, migrations}) => {
  if (driver.init) {
    await driver.init('down')
  }
  
  for (let migration of migrations) {
    const active = await driver.getMigrationState(migration.id)
    if (active) {
      console.log(`Tearing down ${migration.id}`)
      try {
        await migration.down(driver.db)
        await driver.setMigrationDown(migration.id)
      } catch (err) {
        console.log(`Error tearing down ${migration.id}`, err)
      }
    } else {
      console.log(`Migration ${migration.id} is not active`)
    }
  }

  if (driver.finish) {
    await driver.finish('down')
  }
}
