let data = require('.')
let test = require('tape')

test('env', t=> {
  t.ok(data.get, 'data.get')
  t.ok(data.set, 'data.set')
  t.ok(data.destroy, 'data.destroy')
  t.ok(data.incr, 'data.incr')
  t.ok(data.decr, 'data.decr')
})

test('set/get', async t=> {
  t.plan(1)
  let table = 'tacos'
  let key = 'al pastor'
  await data.set({table, key})
  let taco = await data.get({table, key})
  t.ok(taco.key === key, 'get success')
})

test('batch set and count', async t=> {
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
  t.ok(ppl === 3, 'three tacos saved')
})

test('batch get')

test('pagination', async t=> {
  t.plan(2)
  let count = 0
  for await (let page of data.pages({table:'ppl'}) { 
    count++
  }
  t.ok(count === 1, 'one page of ppl')
})

test('destroy')
test('batch destroy')

// incr
// decr
