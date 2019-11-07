const test = require('tape')
const sinon = require('sinon')

const down = require('../../src/down')

test('should run init if provided', function (t) {
  t.plan(1)

  const spy = sinon.spy()
  down({
    driver: { init: spy },
    migrations: []
  })
  t.equal(spy.calledWith('down'), true)
})

test('should run finish if provided', function (t) {
  t.plan(1)

  const spy = sinon.spy()
  down({
    driver: { finish: spy },
    migrations: []
  })
  t.equal(spy.calledWith('down'), true)
})
