let sandbox = require('@architect/sandbox')
let data = require('../')
let test = require('tape')

test('start sandbox', async t => {
  t.plan(1)
  process.env.AWS_ACCESS_KEY_ID = 'arc_dummy_access_key',
  process.env.AWS_SECRET_ACCESS_KEY = 'arc_dummy_secret_key',
  await sandbox.start({ quiet: true, cwd: __dirname })
  t.pass('sandbox.start')
})


test('tables with similar namespacing', async t => {
  t.plan(2)
  // write some data
  const USER_TABLE = 'tempuser'
  const USERNAME_TABLE =  'tempusername'
  const result = await data.set([
    { table: USER_TABLE },
    { table: USERNAME_TABLE }
  ])
  t.ok(result.length === 2, 'wrote two records into two tables')
  console.log(result)
  // query a table
  const users = await data.get({ table: USER_TABLE })
  t.ok(users.length == 1, 'only one user in the user_table')
  console.log(users)
})

test('shutdown sandbox', async t => {
  t.plan(1)
  delete process.env.AWS_ACCESS_KEY_ID
  delete process.env.AWS_SECRET_ACCESS_KEY
  await sandbox.end()
  t.pass('sandbox.end')
})

// ensure clean exit even on hanging async work
process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
  console.log(p)
  sandbox.end()
})
