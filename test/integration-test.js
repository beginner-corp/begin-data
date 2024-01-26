let sandbox = require('@architect/sandbox')
let data = require('../')
let test = require('tape')

test('env', t => {
  t.plan(6)
  t.ok(data.get, 'data.get')
  t.ok(data.set, 'data.set')
  t.ok(data.destroy, 'data.destroy')
  t.ok(data.count, 'data.count')
  t.ok(data.incr, 'data.incr')
  t.ok(data.decr, 'data.decr')
})

test('Start sandbox', async t => {
  t.plan(1)
  await sandbox.start({ cwd: __dirname, quiet: true })
  t.pass('started')
})
  /*
test('get a key that does not exist returns null', async t => {
  t.plan(1)
  let result = await data.get({ table: 'foo', key: 'nooo' })
  t.equal(result, null, 'non existent key returns null')
})

test('set/get/count', async t => {
  t.plan(2)

  let table = 'tacos'
  let key = 'al pastor'

  await data.set({ table, key })

  let taco = await data.get({ table, key })
  t.ok(taco.key === key, 'get success')
  console.log(taco)

  let count = await data.count({ table })
  t.ok(count === 1, 'item count of one')
  console.log('data.count ===', count)
})

test('destroy', async t => {
  t.plan(2)

  let junk = await data.set({ table: 'junk', noop: true })
  t.ok(junk['key'], 'table now has a key')

  await data.destroy(junk)
  let count = await data.count({ table: 'junk' })
  t.ok(count === 0, 'item destroyed')
})

test('batch set (across multiple tables)', async t => {
  t.plan(2)

  await data.set([
    { table: 'ppl', name: 'brian', email: 'b@brian.io' },
    { table: 'ppl', name: 'sutr0', email: 'sutr0@brian.io' },
    { table: 'tacos', key: 'pollo' },
    { table: 'tacos', key: 'carnitas' },
  ])

  let ppl = await data.count({ table: 'ppl' })
  let tacos = await data.count({ table: 'tacos' })

  t.ok(ppl === 2, 'two ppl saved')
  t.ok(tacos === 3, 'three tacos saved')
})

test('limit batch to 25 items', async t => {
  t.plan(1)

  let things = []
  let len = 26
  while (things.length < len)
    things.push({ table: 'things' })

  try {
    await data.set(things)
  }
  catch (e) {
    t.pass(e.message)
  }
})

test('batch destroy', async t => {
  t.plan(1)

  await data.destroy([
    { table: 'tacos', key: 'pollo' },
    { table: 'tacos', key: 'carnitas' },
  ])

  let tacos = await data.count({ table: 'tacos' })
  t.ok(tacos === 1, 'one taco left!')
})

test('batch get', async t => {
  t.plan(1)

  let mountains = [
    { table: 'mountains', name: 'golden ears' },
    { table: 'mountains', name: 'baker' },
    { table: 'mountains', name: 'sky pilot' },
  ]

  let mtns = await data.set(mountains)
  let result = await data.get(mtns)

  t.ok(result.length === 3, 'read mountains')
  console.log(result)
})

test('incr/decr', async t => {
  t.plan(10)

  let table = 'things-i-like'
  let key = 'trees'
  let prop = 'mycount'

  let incrRes = await data.incr({ table, key, prop })
  t.ok(incrRes.mycount === 1, 'incrRes is one')
  t.ok(incrRes.table === table, 'incrRes.table is correct')
  t.ok(incrRes.key === key, 'incrRes.key is correct')
  t.ok(incrRes.scopeID === undefined, 'incrRes.scopeID is undefined')
  t.ok(incrRes.dataID === undefined, 'incrRes.dataID is undefined')

  let decrRes = await data.decr({ table, key, prop })
  t.ok(decrRes.mycount === 0, 'decrRes is zero')
  t.ok(decrRes.table === table, 'decrRes.table is correct')
  t.ok(decrRes.key === key, 'decrRes.key is correct')
  t.ok(decrRes.scopeID === undefined, 'decrRes.scopeID is undefined')
  t.ok(decrRes.dataID === undefined, 'decrRes.dataID is undefined')
})
  */
test('Node 8+ cursor style pagination', async t => {
  t.plan(2)

  // add 100 ppl (25 at a time)
  console.time('add 100 ppl')
  let table = 'ppl'
  let ppls = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 25; j++) {
      if (!ppls[i])
        ppls[i] = []
      ppls[i].push({ table })
    }
  }
  await Promise.all(ppls.map(async ppl => {
    await data.set(ppl)
  }))
  console.timeEnd('add 100 ppl')

  // read the first 100
  let result = await data.get({ table, limit: 100 })
  t.ok(result.length === 100, 'got the first 100 ppl')
  t.ok(result.cursor, `got cursor ${result.cursor}`)
  console.log(result)

  // get the last two
  let result2 = await data.get({ table, cursor: result.cursor })
  console.log(result2)
  //t.ok(result2.length === 2, 'got last two ppl')
  //t.ok(typeof result2.cursor === 'undefined', 'and no cursor')
})
/*
test('implementing a scan', t => {
  t.plan(1)

  // example errback style scan impl
  function scan (params, callback) {
    let allppl = []
    function _scan (params, callback) {
      data.get(params, function get (err, result) {
        if (err) callback(err)
        else {
          allppl = allppl.concat(result)
          if (result.cursor) {
            let props = {
              table: params.table,
              cursor: result.cursor
            }
            if (params.limit)
              props.limit = params.limit
            _scan(props, callback)
          }
          else {
            callback(null, allppl)
          }
        }
      })
    }
    _scan(params, callback)
  }

  // testing the scan out
  let table = 'ppl'
  let limit = 30
  scan({ table, limit }, function done (err, ppl) {
    if (err) throw err
    t.pass('done')
    console.log('total ppl', ppl.length)
  })
})

test('using multiple tables to get range queries (aka sort key)', async t => {
  t.plan(4)

  await data.set([
    { table: 'games', key: 'hockey' },
    { table: 'games', key: 'baseball' },
    { table: 'games', key: 'curling' },
    { table: 'hockey', key: '2019-09-16-canucks-at-flames', title: 'canucks at flames' },
    { table: 'hockey', key: '2019-09-17-oilers-at-canucks', title: 'oilers at canucks' },
    { table: 'hockey', key: '2019-09-19-canucks-at-oilers', title: 'canucks at oilers' },
    { table: 'hockey', key: '2019-09-21-canucks-at-kings', title: 'canucks at kings' },
    { table: 'hockey', key: '2019-10-17-canucks-at-blues', title: 'canucks at blues' },
  ])

  // can list all possible indices
  let indices = await data.get({ table: 'games' })
  t.ok(indices.length > 0, 'indices')
  console.log(indices)

  // can retrive by key
  let game = await data.get({ table: 'hockey', key: '2019-09-21-canucks-at-kings' })
  t.ok(!!game.title, game.title)

  // can retrieve by sport
  let curling = await data.get({ table: 'curling' })
  t.ok(curling.length === 0, 'no curling games in data')

  // can retrieve by date!!
  let sept = await data.get({ table: 'hockey', begin: '2019-09' }) // 🆕
  t.ok(sept.length === 4, 'four games in sept')
  console.log(sept)
})

test('paginate ten at a time', async t => {
  t.plan(1)

  let pages = data.page({ table: 'ppl', limit: 25 })
  let count = 0
  for await (let page of pages) {
    console.log(page)
    count++
  }

  t.ok(count === 5, 'counted five pages (102 records at 25 per page)')
  console.log(count)
})
*/
// fin
test('shutdown sandbox', async t => {
  t.plan(1)
  await sandbox.end()
  t.pass('done')
})

// ensure clean exit even on hanging async work
process.on('unhandledRejection', async (reason, p) => {
  console.log(reason)
  console.log(p)
  await sandbox.end()
})
