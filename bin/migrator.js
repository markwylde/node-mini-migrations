#!/usr/bin/env node
const program = require('commander')
const packageJson = require('../package.json')

const prepareRun = require('../src/prepareRun')
const up = require('../src/up')
const down = require('../src/down')

program
  .version(packageJson.version)
  .option('-d, --directory <dir>', 'specify the location of the migrations directory', './migrations')

program
  .command('up')
  .action((file, cmd) => {
    up({
      logger: console.log,
      ...prepareRun(program.directory)
    })
  })

program
  .command('down')
  .action((file, cmd) => {
    down({
      logger: console.log,
      ...prepareRun(program.directory)
    })
  })

program
  .parse(process.argv)
