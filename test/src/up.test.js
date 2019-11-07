const test = require('tape')
const sinon = require('sinon')

const up = require('../../src/up')

test('should run init if provided', function (t) {
  t.plan(1)

  const spy = sinon.spy()
  up({
    driver: { init: spy },
    migrations: []
  })
  t.equal(spy.calledWith('up'), true)
})

test('should run finish if provided', function (t) {
  t.plan(1)

  const spy = sinon.spy()
  up({
    driver: { finish: spy },
    migrations: []
  })
  t.equal(spy.calledWith('up'), true)
})
