# Begin Data

[ ![Codeship Status for smallwins/begin-data](https://app.codeship.com/projects/54207a80-9b6b-0136-cc78-3a6df96c6020/status?branch=master)](https://app.codeship.com/projects/305743)

Begin Data is a durable and fast key/value store built on top of DynamoDB with super simple storage/access patterns that are similar to Redis.

## Concepts

Begin Data organizes itself into tables. Tables contain items which are just collections of plain `Object`s. Items stored in Begin Data always have the properties `table` and `key`. Optionally an item can also have a `ttl` property with a UNIX epoch value representing the expiry time for the item.

### API

```javascript
let data = require('@begin/data')
```

The core API is three methods:

- `data.get(params, [callback])` for retreiving data
- `data.set(params, [callback])` for writing data 
- `data.destroy(params, [callback])` for removing data

Additional helper methods are also made available:

- `data.incr(params, [callback])` increment an attribute on an item
- `data.decr(params, [callback])` decrement an attribute on an item
- `data.count(params, [callback])` get the number of items for a given table

All methods require a params object and, optionally, a Node style errback. If no errback is supplied a promise is returned. All methods support `async`/`await`.

#### Writes

Save an item in a table by key. Remember `table` is always required.

```javascript
let taco = await data.set({
  table: 'tacos', 
  key: 'al-pastor'
})
```

`key` is optional. But all items have a key. If no key is given `set` will generate a unique `key`. 

```javascript
let token = data.set({
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

Read an item by key:

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

Or scan an entire table.

```javascript
let users = data.get({table:'users'})
for await (let user of users()) {
  console.log(user) 
}
```

If you want to paginate pass a limit:

```javascript
let users = data.get({table:'users', limit:10})
for await (let page of users()) {
  console.log(page) // array of 10 users 
}
```

#### Destroy

Delete an item by key.

```javascript
await data.destroy({
  table: 'tacos', 
  key: 'pollo'
})
```

Batch delete items by passing an array of objects.

```javascript
await data.destroy([
  {table:'tacos', key:'carnitas'},
  {table:'tacos', key:'al-pastor'},
])
```

## Additional Superpowers

- Documents can be expired by setting `ttl` to an UNIX epoch in the future.
- Atomic counters: `data.incr` and `data.decr`

## Patterns

Coming soon! Detailed guides for various data persistence tasks:

- denormalizing
- pagination
- counters
- secondary indexes
- one to many
- many to many
