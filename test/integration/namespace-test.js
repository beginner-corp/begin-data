let sandbox = require('@architect/sandbox')
let data = require('../../.')
let test = require('tape')

test('start sandbox', async t=> {
  t.plan(1)
  await sandbox.start()
  t.ok(true, 'sandbox.start')
})

test('tables with similar namespacing', async t=> {
  t.plan(2)
  // write some data
  const USER_TABLE = "tempuser"
  const USERNAME_TABLE =  "tempusername"
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

test('shutdown sandbox', async t=> {
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'sandbox.end')
})

// ensure clean exit even on hanging async work
process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
  console.log(p)
  end()
})
