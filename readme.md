# Begin Data
## [`@begin/data`](https://www.npmjs.com/package/@begin/data)

[![GitHub CI status](https://github.com/smallwins/begin-data/workflows/Node%20CI/badge.svg)](https://github.com/smallwins/begin-data/actions?query=workflow%3A%22Node+CI%22)

Begin Data is an easy to use, fast, and durable key/value and document store built on top of DynamoDB. Originally built for [Begin serverless apps](https://begin.com), Begin Data’s core API has three simple methods: `get`, `set`, and `destroy`.

## Concepts

Begin Data organizes itself into `table`s. A `table` contain documents which are just collections of plain Objects. Documents stored in Begin Data always have the properties `table` and `key`.

Optionally a document can also have a `ttl` property with a UNIX epoch value representing the expiry time for the document.

## Usage

Begin Data operates on one DynamoDB table named `data` with a partition key `scopeID` and a sort key of `dataID` (and, optionally, a `ttl` for expiring documents).

Example `app.arc`:

```
@app
myapp

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
```

Or equivalent CloudFormation YAML:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Resources:
    BeginData:
        Type: "AWS::DynamoDB::Table"
        Properties:
            TableName: "data"
            BillingMode: "PAY_PER_REQUEST"
            KeySchema:
              -
                AttributeName: "scopeID"
                KeyType: "HASH"
              -
                AttributeName: "dataID"
                KeyType: "RANGE"
            SSESpecification:
                Enabled: "false"
            TimeToLiveSpecification:
                AttributeName: "ttl"
                Enabled: "TRUE"
```

> Note: projects not based on [Architect](https://arc.codes) will need a `BEGIN_DATA_TABLE_NAME` environment variable. You can also use this env var to override and name the table anything you want. This also allows for multiple apps to share a single table.

### API

```javascript
let data = require('@begin/data')
```

The core API is three methods:

- `data.get(params[, callback])` → `[Promise]` for retreiving data
- `data.set(params[, callback])` → `[Promise]` for writing data
- `data.destroy(params[, callback])` → `[Promise]` for removing data

Additional helper methods are also made available:

- `data.incr(params[, callback])` → `[Promise]` increment an attribute on a document
- `data.decr(params[, callback])` → `[Promise]` decrement an attribute on a document
- `data.count(params[, callback])` → `[Promise]` get the number of documents for a given table

All methods accept a params object and, optionally, a Node-style errback. If no errback is supplied, a Promise is returned. All methods support `async`/`await`.

#### Writes

Save a document in a `table` by `key`. Remember: `table` is required; `key` is optional.

```javascript
let taco = await data.set({
  table: 'tacos',
  key: 'al-pastor'
})
```

All documents have a `key`. If no `key` is given, `set` will generate a unique `key`.

```javascript
let token = await data.set({
  table: 'tokens',
})
// {table:'tokens', key:'LCJkYX9jYWwidW50RhSU'}
```

Batch save multiple documents at once by passing an Array of Objects.

```javascript
let collection = await data.set([
  {table: 'ppl', name:'brian', email:'b@brian.io'},
  {table: 'ppl', name:'sutr0', email:'sutr0@brian.io'},
  {table: 'tacos', key:'pollo'},
  {table: 'tacos', key:'carnitas'},
])
```

#### Reads

Read a document by `key`:

```javascript
let yum = await data.get({
  table: 'tacos',
  key: 'baja'
})
```

Batch read by passing an Array of Objects. With these building blocks you can construct secondary indexes and joins, like one-to-many and many-to-many.

```javascript
await data.get([
  {table:'tacos', key:'carnitas'},
  {table:'tacos', key:'al-pastor'},
])
```

#### Destroy

Delete a document by `key`.

```javascript
await data.destroy({
  table: 'tacos',
  key: 'pollo'
})
```

Batch delete documents by passing an Array of Objects.

```javascript
await data.destroy([
  {table:'tacos', key:'carnitas'},
  {table:'tacos', key:'al-pastor'},
])
```

## Pagination

Large sets of data can not be retrieved in one call because the underlying `get` api paginates results.
In this case use the `for await` syntax with a limit set to get paginated data.

```javascript
let pages = data.page({ table:'ppl', limit:25 })
let count = 0  
for await (let page of pages) {
  console.log(page)
  count++
}
```

## Additional Superpowers

- Documents can be expired by setting `ttl` to an UNIX epoch in the future.
- Atomic counters: `data.incr` and `data.decr`

See the tests for more examples!

## Patterns

Coming soon! Detailed guides for various data persistence tasks:

- Denormalizing
- Pagination
- Counters
- Secondary indexes
- One to many
- Many to many

## More

- [Try out Begin Data on Begin!](https://begin.com)
- [Learn more about Begin Data](https://docs.begin.com/en/data/begin-data/)
