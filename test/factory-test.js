let sandbox = require('@architect/sandbox')
let { Table, factory } = require('../')
let test = require('tape')

test('start sandbox', async t => {
  t.plan(1)
  await sandbox.start({ cwd: __dirname, quiet: true })
  t.pass('started')
})

test('classy style', async t => {
  t.plan(4)
  let cats = new Table('cats')
  let sutr0 = await cats.set({ name: 'sutr0' })
  let again = await cats.get(sutr0)
  t.ok(!!sutr0.key, 'has key')
  t.ok(!!sutr0.table === false, 'but no table')
  t.ok(again.key === sutr0.key, 'found sutr0')
  t.ok(!!again.table === false, 'but no table')
  console.log(sutr0, again)
})

test('factory style', async t => {
  t.plan(2)
  let [ cats, dogs ] = factory('cats', 'dogs')
  let tuxedo = await cats.set({ name: 'tuxedo' })
  let yoda = await dogs.set({ name: 'yoda' })
  t.ok(!!tuxedo.key, 'tuxedo has key')
  t.ok(!!yoda.key, 'yoda has key')
  console.log(tuxedo, yoda)
})

test('page', async t => {
  t.plan(1)
  let cats = factory('cats')
  let pages = await cats.page({ limit: 1 })
  let count = 0
  for await (let c of pages)
    count += c.length
  t.ok(count === 2, 'found two cats')
})

test('count', async t => {
  t.plan(1)
  let cats = factory('cats')
  let len = await cats.count()
  t.ok(len === 2, 'found two cats')
})

test('end sandbox', async t => {
  t.plan(1)
  await sandbox.end()
  t.pass('ended')
})
