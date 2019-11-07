const fs = require('fs')
const test = require('tape')
const sqlite = require('sqlite')

const {prepareRun, down, up} = require('../src')

function clean () {
  if (fs.existsSync('./test.sqlite')) {
    fs.unlinkSync('./test.sqlite')
  }
}

test('migrate examples up', async function (t) {
  t.plan(2)

  clean()

  await up(prepareRun('./example'))

  t.ok(fs.existsSync('./test.sqlite'))

  const db = await sqlite.open('./test.sqlite')
  const result = await db.get('SELECT * FROM test_table')
  t.equal(result.test, 'hello')

  await db.close()
})

test('migrate examples up, down', async function (t) {
  t.plan(2)

  clean()

  await up(prepareRun('./example'))
  await down(prepareRun('./example'))

  const db = await sqlite.open('./test.sqlite')
  const tables = await db.all(`SELECT name FROM sqlite_master WHERE type='table'`)
  t.equal(tables.length, 1)
  t.equal(tables[0].name, '_migrations')

  await db.close()
})

test('migrate examples up, down, then up again', async function (t) {
  t.plan(2)

  clean()

  await up(prepareRun('./example'))
  await down(prepareRun('./example'))
  await up(prepareRun('./example'))

  t.ok(fs.existsSync('./test.sqlite'))

  const db = await sqlite.open('./test.sqlite')
  const result = await db.get('SELECT * FROM test_table')
  t.equal(result.test, 'hello')

  await db.close()
})