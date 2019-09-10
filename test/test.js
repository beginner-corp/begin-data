let sandbox = require('@architect/sandbox')
let data = require('../.')
let test = require('tape')


/**
 * ensure the api is present
 */
test('env', t=> {
  t.plan(6)
  //t.ok(arc.sandbox, 'arc.sandbox')
  t.ok(data.get, 'data.get')
  t.ok(data.set, 'data.set')
  t.ok(data.destroy, 'data.destroy')
  t.ok(data.count, 'data.count')
  t.ok(data.incr, 'data.incr')
  t.ok(data.decr, 'data.decr')
})


/**
 * sandbox boilerplate
 */
let end
test('start sandbox', async t=> {
  t.plan(1)
  end = await sandbox.start()
  console.log(end)
  t.ok(true, 'started')
})

/**
 * try out the basic reads
 */
test('get a key that does not exist returns null', async t=> {
  t.plan(1)
  let result = await data.get({table:'foo', key:'nooo'})
  t.equal(result, null, 'non existent key returns null')
})

test('set/get/count', async t=> {
  t.plan(2)

  let table = 'tacos'
  let key = 'al pastor'

  await data.set({table, key})

  let taco = await data.get({table, key})
  t.ok(taco.key === key, 'get success')
  console.log(taco)

  let count = await data.count({table})
  t.ok(count === 1, 'item count of one')
  console.log('data.count ===', count)
})


/**
 * item max size: 10KB
 */
test('Size limit test', async t=> {
  t.plan(1)
  // eslint-disable-next-line
  let doc = require('./mock.json')
  doc.books = doc.books.concat(doc.books)
                       .concat(doc.books) // in triplicate
  try {
    await data.set(doc)
  }
  catch(e) {
    t.ok(true, e.message)
  }
})


/**
 * destroy an item via key
 */
test('destroy', async t=> {
  t.plan(2)

  let junk = await data.set({table:'junk', noop:true})
  t.ok(junk.hasOwnProperty('key'), 'table now has a key')

  await data.destroy(junk)
  let count = await data.count({table:'junk'})
  t.ok(count === 0, 'item destroyed')
})


/**
 * batch write a bunch of items
 */
test('batch set (across multiple tables)', async t=> {
  t.plan(2)

  await data.set([
    {table: 'ppl', name:'brian', email:'b@brian.io'},
    {table: 'ppl', name:'sutr0', email:'sutr0@brian.io'},
    {table: 'tacos', key:'pollo'},
    {table: 'tacos', key:'carnitas'},
  ])

  let ppl = await data.count({table:'ppl'})
  let tacos = await data.count({table:'tacos'})

  t.ok(ppl === 2, 'two ppl saved')
  t.ok(tacos === 3, 'three tacos saved')
})


/**
 * limit batch to 25 items (we can expand this to stream in the future)
 */
test('set batch max exceeded', async t=> {
  t.plan(1)

  let things = []
  let len = 26
  while (things.length < len)
    things.push({table:'things'})

  try {
    await data.set(things)
  }
  catch(e) {
    t.ok(true, e.message)
  }
})


/**
 * batch destroy removes many items at once
 */
test('batch destroy', async t=> {
  t.plan(1)

  await data.destroy([
    {table: 'tacos', key:'pollo'},
    {table: 'tacos', key:'carnitas'},
  ])

  let tacos = await data.count({table:'tacos'})
  t.ok(tacos === 1, 'one taco left!')
})


/**
 * batch get many items at once
 */
test('batch get', async t=> {
  t.plan(1)

  let mountains = [
    {table: 'mountains', name:'golden ears'},
    {table: 'mountains', name:'baker'},
    {table: 'mountains', name:'sky pilot'},
  ]

  let mtns = await data.set(mountains)
  let result = await data.get(mtns)

  t.ok(result.length === 3, 'read mountains')
  console.log(result)
})


/**
 * incr/decr an item
 */
test('incr/decr', async t=> {
  t.plan(2)

  let table = 'things-i-like'
  let key = 'trees'
  let prop = 'mycount'

  await data.set({
    table,
    key,
    mycount:0
  })

  let adds = await data.incr({table, key, prop})
  t.ok(adds.mycount === 1, 'is one')

  let minuses = await data.decr({table, key, prop})
  t.ok(minuses.mycount === 0, 'and done')
})


/**
 * cursor pagination
 */
test('node8.10 cursor style pagination', async t=> {
  t.plan(4)

  // add 100 ppl (25 at a time)
  console.time('add 100 ppl')
  let table = 'ppl'
  let ppls = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 25; j++) {
      if (!ppls[i])
        ppls[i] = []
      ppls[i].push({table})
    }
  }
  await Promise.all(ppls.map(async ppl=> {
    await data.set(ppl)
  }))
  console.timeEnd('add 100 ppl')

  // read the first 100
  let result = await data.get({table, limit:100})
  t.ok(result.length === 100, 'got the first 100 ppl')
  t.ok(result.cursor, `got cursor ${result.cursor}`)

  // get the last two
  let result2 = await data.get({table, cursor: result.cursor})
  t.ok(result2.length === 2, 'got last two ppl')
  t.ok(typeof result2.cursor === 'undefined', 'and no cursor')
})


/**
 * scanning items
 */
test('implementing a scan', t=> {
  t.plan(1)

  // example errback style scan impl
  function scan(params, callback) {
    let allppl = []
    function _scan(params, callback) {
      data.get(params, function get(err, result) {
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
  scan({table, limit}, function done(err, ppl) {
    if (err) throw err
    t.ok(true, 'done')
    console.log('total ppl', ppl.length)
  })
})

/**
 *
 */
test('using multiple tables to get range queries (aka sort key)', async t=> {
  t.plan(4)

  await data.set([
    {table: 'games', key: 'hockey'},
    {table: 'games', key: 'baseball'},
    {table: 'games', key: 'curling'},
    {table: 'hockey', key: '2019-09-16-canucks-at-flames', title: 'canucks at flames'},
    {table: 'hockey', key: '2019-09-17-oilers-at-canucks', title: 'oilers at canucks'},
    {table: 'hockey', key: '2019-09-19-canucks-at-oilers', title: 'canucks at oilers'},
    {table: 'hockey', key: '2019-09-21-canucks-at-kings', title: 'canucks at kings'},
    {table: 'hockey', key: '2019-10-17-canucks-at-blues', title: 'canucks at blues'},
  ])

  // can list all possible indices
  let indices = await data.get({table: 'games'})
  t.ok(indices.length > 0, 'indices')
  console.log(indices)
  
  // can retrive by key
  let game = await data.get({table: 'hockey', key: '2019-09-21-canucks-at-kings'}) 
  t.ok(!!game.title, game.title)

  // can retrieve by sport
  let curling = await data.get({table: 'curling'}) 
  t.ok(curling.length === 0, 'no curling games in data')
  
  // can retrieve by date!!
  let sept = await data.get({table: 'hockey', begin: '2019-09'}) // 🆕
  t.ok(sept.length === 4, 'four games in sept')
  console.log(sept)
})

// * node10 pagination will have to wait for a lambda upgrade!
// we could start mocking this in with a generator but the syntax is ugly in node8.10
//
//test('paginate ten at a time', async t=> {
//  t.plan(2)
//  let pages = data.page({table:'ppl', limit:10})
//  let count = 0
//  for await (let page of pages()) {
//    count++
//  }
//  t.ok(count === 1, 'one page of ppl')
//})
//
//test('stream one at a time', async t=> {
//  t.plan(2)
//  let ppl = data.page({table:'ppl'})
//  for await (let person of ppl()) {
//    console.log(person)
//    break
//  }
//})


// fin
test('shutdown sandbox', t=> {
  t.plan(1)
  end()
  t.ok(true, 'done')
})


// ensure clean exit even on hanging async work
process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
  console.log(p)
  end()
})
