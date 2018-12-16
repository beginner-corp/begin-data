let arc = require('@architect/architect')
let data = require('.')
let test = require('tape')

test('env', t=> {
  t.plan(6)
  t.ok(arc.sandbox, 'arc.sandbox')
  t.ok(data.get, 'data.get')
  t.ok(data.set, 'data.set')
  t.ok(data.destroy, 'data.destroy')
  t.ok(data.incr, 'data.incr')
  t.ok(data.decr, 'data.decr')
})

let end
test('start sandbox', async t=> {
  t.plan(1)
  end = await arc.sandbox.start()
  t.ok(true, 'started')
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
  t.ok(count === 1, 'count of one')
  console.log(count)
})

test('batch set', async t=> {
  t.plan(1)//2)
  let result = await data.set([
    {table: 'ppl', name:'brian', email:'b@brian.io'},
    {table: 'ppl', name:'sutr0', email:'sutr0@brian.io'},
    {table: 'tacos', key:'pollo'},
    {table: 'tacos', key:'carnitas'},
  ])
  let ppl = await data.count({table:'ppl'})
  let tacos = await data.count({table:'tacos'})
  t.ok(ppl === 2, 'two ppl saved')
  console.log({result, ppl, tacos})
  //t.ok(ppl === 3, 'three tacos saved')
})

/*
test('pagination', async t=> {
  t.plan(2)
  let count = 0
  for await (let page of data.pages({table:'ppl'})) { 
    count++
  }
  t.ok(count === 1, 'one page of ppl')
})
*/

test('batch get')
test('destroy')
test('batch destroy')
test('incr')
test('decr')

// fin
test('shutdown sandbox', t=> {
  t.plan(1)
  end()
  t.ok(true, 'done')
})
