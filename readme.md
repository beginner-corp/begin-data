# Begin Data

[ ![Codeship Status for smallwins/begin-data](https://app.codeship.com/projects/54207a80-9b6b-0136-cc78-3a6df96c6020/status?branch=master)](https://app.codeship.com/projects/305743)

Begin Data is a durable and fast key/value store built on top of DynamoDB with super simple storage/access patterns that are similar to Redis.

## Concepts

Begin Data organizes itself into tables. Tables contain documents which are just collections of plain `Object`s. documents stored in Begin Data always have the properties `table` and `key`. Optionally an document can also have a `ttl` property with a UNIX epoch value representing the expiry time for the document.

### API

```javascript
let data = require('@begin/data')
```

The core API is three methods:

- `data.get(params, [callback])` for retreiving data
- `data.set(params, [callback])` for writing data 
- `data.destroy(params, [callback])` for removing data

Additional helper methods are also made available:

- `data.incr(params, [callback])` increment an attribute on an document
- `data.decr(params, [callback])` decrement an attribute on an document
- `data.count(params, [callback])` get the number of documents for a given table

All methods require a params object and, optionally, a Node style errback. If no errback is supplied a promise is returned. All methods support `async`/`await`.

#### Writes

Save an document in a table by key. Remember `table` is always required.

```javascript
let taco = await data.set({
  table: 'tacos', 
  key: 'al-pastor'
})
```

`key` is optional. But all documents have a key. If no key is given `set` will generate a unique `key`. 

```javascript
let token = await data.set({
  table: 'tokens', 
})
// {table:'tokens', key:'s89sdfjskfdj'}
```

Batch save multiple documents at once by passing an array of objects.

```javascript
let collection = await data.set([
  {table: 'ppl', name:'brian', email:'b@brian.io'},
  {table: 'ppl', name:'sutr0', email:'sutr0@brian.io'},
  {table: 'tacos', key:'pollo'},
  {table: 'tacos', key:'carnitas'},
])
```

#### Reads

Read an document by key:

```javascript
let yum = await data.get({
  table: 'tacos', 
  key: 'baja'
})
```

Batch read by passing an array of objects. With these building blocks you can construct secondary indexes and joins like one-to-many and many-to-many.

```javascript
await data.get([
  {table:'tacos', key:'carnitas'},
  {table:'tacos', key:'al-pastor'},
])
```

#### Destroy

Delete an document by key.

```javascript
await data.destroy({
  table: 'tacos', 
  key: 'pollo'
})
```

Batch delete documents by passing an array of objects.

```javascript
await data.destroy([
  {table:'tacos', key:'carnitas'},
  {table:'tacos', key:'al-pastor'},
])
```

## Additional Superpowers

- Documents can be expired by setting `ttl` to an UNIX epoch in the future.
- Atomic counters: `data.incr` and `data.decr`

See the tests for more examples!

## Patterns

Coming soon! Detailed guides for various data persistence tasks:

- denormalizing
- pagination
- counters
- secondary indexes
- one to many
- many to many
