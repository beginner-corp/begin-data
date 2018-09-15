var test = require('tape')
var parallel = require('run-parallel')
var client = require('../src')

// these test offline

// write a document (and generate a key) to a namespace
test('data.set with ns only', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    bar: true
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

test('data.set with ns and key', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    key: 'baz',
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

test('data.get namespaces', t=> {
  t.plan(1)
  client.get({}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
      //console.log(client._offline)
    }
  })
})

test('data.get with ns only', t=> {
  t.plan(1)
  client.get({
    ns: 'foo', 
    bar: true
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
      //console.log(client._offline)
    }
  })
})

test('data.get with ns and key', t=> {
  t.plan(1)
  client.get({
    ns: 'foo', 
    key: 'baz'
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
      // console.log(client._offline)
    }
  })
})

// write a document by key to a namespace
test('data.set with a key', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    baz: 1,
    key: 'whatever',
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// write a document by key to a namespace
test('data.del with a key', t=> {
  t.plan(1)
  client.del({
    ns: 'foo', 
    key: 'whatever',
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

test('data.del with a batch', t=> {
  t.plan(1)
  client.del([{
    ns: 'foo', 
    key: 'baz',
  }],
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

test('batch write', t=> {
  t.plan(1)
  client.set([
    {ns:'foo', key:'pizzas'}, 
    {ns:'foo', key:'whatever'}, 
  ],
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

test('batch read', t=> {
  t.plan(1)
  client.get([
    {ns:'foo', key:'pizzas'}, 
    {ns:'foo', key:'whatever'}, 
  ],
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
     //  console.log(client._offline)
    }
  })
})

// write a document (and generate a key) to a namespace
test('data.set', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    bar: true
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// write a document by key to a namespace
test('data.set with a key', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    baz: 1,
    key: 'whatever',
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// write many documents at once
test('batch write', t=> {
  t.plan(1)
  client.set([
    {ns:'foo', key:'baz'}, 
    {ns:'bar', go:{giants:true}}, 
  ], 
  function _set(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

// return all the documents in a namespace
var foos
test('data.get foo ns documents', t=> {
  t.plan(1)
  client.get({ns:'foo'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
      foos = result.docs
    }
  })
})

// delete the rest of teh foos
test('batch delete foos', t=> {
  t.plan(1)
  client.del(foos, function _del(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result.deleted, 'got result')  
      console.log(result)
    }
  })
})

// write a document (and generate a key) to a namespace
test('data.set', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    bar: true
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// write a document by key to a namespace
test('data.set with a key', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    baz: 1,
    key: 'whatever',
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// list all namespaces
test('data.get namespaces', t=> {
  t.plan(1)
  client.get({}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, '??? result')  
      console.log(result)
    }
  })
})

// read one document by namespace and key
test('data.get a document by key', t=> {
  t.plan(1)
  client.get({
    ns: 'foo',
    key: 'whatever',
  }, 
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

// return all the documents in a namespace
test('data.get ns documents', t=> {
  t.plan(1)
  client.get({ns:'foo'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

// write many documents at once
test('batch write', t=> {
  t.plan(1)
  client.set([
    {ns:'foo', key:'baz'}, 
    {ns:'bar', go:{giants:true}}, 
  ], 
  function _set(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

// return all the documents in a namespace
test('data.get foo ns documents', t=> {
  t.plan(1)
  client.get({ns:'foo'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

// return all the documents in a namespace
test('data.get bar ns documents', t=> {
  t.plan(1)
  client.get({ns:'bar'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

// list all namespaces
test('data.get namespaces now has two entries', t=> {
  t.plan(1)
  client.get({}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result.namespaces.length === 2, '2 results')  
      console.log(result)
    }
  })
})

// return all the documents in a namespace
var foos
test('data.get foo ns documents', t=> {
  t.plan(1)
  client.get({ns:'foo'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
      foos = result.docs
    }
  })
})

// batchRead
test('batch read', t=> {
  t.plan(1)
  client.get([
    {ns:'foo', key:'pizzas'}, 
    {ns:'foo', key:'whatever'}, 
  ],
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

test('read all of foo ns', t=> {
  t.plan(1)
  client.get({ns:'foo'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'all of foo')  
      console.log(result)
    }
  })
})

test('batch write', t=> {
  t.plan(1)
  client.set([
    {ns:'foo', key:'baz'}, 
    {ns:'bar', go:{giants:true}}, 
  ], 
  function _set(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})
//
// write a document (and generate a key) to a namespace
test('data.set', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    key: 'baz'
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// delete
test('data.del baz key from foo namespace', t=> {
  t.plan(1)
  client.del({
    ns: 'foo',
    key: 'baz'
  }, 
  function _del(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(true, 'got result')  
      console.log(result)
    }
  })
})
//
// write a document (and generate a key) to a namespace
test('data.set', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    key: 'whatever'
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// list all namespaces
test('data.get namespaces', t=> {
  t.plan(1)
  client.get({}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, '??? result')  
      console.log(result)
    }
  })
})

// read one document by namespace and key
test('data.get a document by key', t=> {
  t.plan(1)
  client.get({
    ns: 'foo',
    key: 'whatever',
  }, 
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

// return all the documents in a namespace
test('data.get ns documents', t=> {
  t.plan(1)
  client.get({ns:'foo'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})
//
// write a document (and generate a key) to a namespace
test('data.set', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    bar: true
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// write a document by key to a namespace
test('data.set with a key', t=> {
  t.plan(1)
  client.set({
    ns: 'foo', 
    baz: 1,
    key: 'whatever',
  },
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'got result')  
      console.log(result)
    }
  })
})

// write many documents at once
test('batch write', t=> {
  t.plan(1)
  client.set([
    {ns:'foo', key:'baz'}, 
    {ns:'bar', go:{giants:true}}, 
  ], 
  function _set(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

test('can incr a key', t=> {
  t.plan(1)
  console.log(client._offline)
  client.incr({
    ns:'baz', 
    key:'pizzas'
  }, 
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

test('can incr a key', t=> {
  t.plan(1)
  var one = client.incr.bind({}, {ns:'foo', key:'pizzas'})
  var two = client.incr.bind({}, {ns:'foo', key:'pizzas'})
  var three = client.incr.bind({}, {ns:'foo', key:'pizzas'})
  parallel([
    one, two, three
  ], 
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})
test('can incr a key', t=> {
  t.plan(1)
  var one = client.incr.bind({}, {ns:'foo', key:'pizzas', attr:'eaten'})
  var two = client.incr.bind({}, {ns:'foo', key:'pizzas', attr:'eaten'})
  parallel([
    one, two, 
  ], 
  function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'result')  
      console.log(result)
    }
  })
})

test('has three but ate two', t=> {
  t.plan(1)
  client.get({ns:'foo', key:'pizzas'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result.count === 3 && result.eaten === 2, 'two pizza teams')  
      console.log(result)
    }
  })
})

// decr key
test('gave away the extra pizza', t=> {
  t.plan(1)
  client.decr({ns:'foo', key:'pizzas'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result, 'two pizza teams')  
      console.log(result)
    }
  })
})

test('has two and ate two', t=> {
  t.plan(1)
  client.get({ns:'foo', key:'pizzas'}, function _get(err, result) {
    if (err) {
      t.fail(err, err)
    }
    else {
      t.ok(result.count === 2 && result.eaten === 2, 'two pizza teams')  
      console.log(result)
    }
  })
})
