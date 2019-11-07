const path = require('path')
const fs = require('fs')

const prepareRun = (dir) => {
  dir = path.resolve(dir)
  const driver = require(path.join(dir, 'driver.js'))

  const migrations = fs.readdirSync(dir)
    .filter(file => !['driver.js'].includes(file))
    .filter(file => file.endsWith('.js'))
    .map(file => ({ id: file, ...require(path.join(dir, file)) }))

  return { driver, migrations }
}

module.exports = prepareRun
