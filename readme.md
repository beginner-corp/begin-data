# Begin Data

[ ![Codeship Status for smallwins/begin-data](https://app.codeship.com/projects/54207a80-9b6b-0136-cc78-3a6df96c6020/status?branch=master)](https://app.codeship.com/projects/305743)

Begin Data is a durable and fast key/value store for Begin built on top of DynamoDB. Its storage/access patterns are quite simple, and similar to Redis.


### Considerations

- A document is maximum 100KB
- Paginated reads return 1MB per page 
- namespaces are unique to an app
- keys are unique to a namespace
- namespaces and keys must start with a letter
- namespaces and keys can only contain lowercase characters, numbers, dashes, and colons
- namespaces and keys must be minimum 1 character and max 255 characters


## Data Types

Namespaces contain documents. Documents stored in Begin Data always have the following keys:

- `ns` which references the document namespace 
- `key` which is a unique identifier within a namespace

Optionally a document can also have a `ttl` key with a UNIX epoch value representing the expiry time for the document.

> Every namespace also has a reserved key `_count` which is used for generating unique keys within the namespace


### API

Grab a Begin Data client named `data`.

```javascript
let data = require('@begin-functions/data')
```


#### Writes

Save a document in a namespace by key. Remember `ns` is always required.

```javascript
data.set({
  ns: 'tacos', 
  key: 'al-pastor'
}, console.log)
```

`key` is optional. But all documents have a key. If no key is given `set` will generate a `key` unique to the namespace. 

```javascript
data.set({
  ns: 'tacos', 
}, console.log)
```

Batch save multiple documents at once by passing an array of objects.

```javascript
data.set([
  {ns: 'ppl', name:'brian', email:'b@brian.io'},
  {ns: 'ppl', name:'sutr0', email:'sutr0@brian.io'},
  {ns: 'tacos', key:'pollo'},
  {ns: 'tacos', key:'carnitas'},
], console.log)
```


#### Reads

Read a document by key.

```javascript
data.get({
  ns: 'tacos', 
  key: 'al-pastor'
}, console.log)
```

Or paginate an entire namespace.

```javascript
// define a read function
function read(cursor) {

  var uery = {ns: 'tacos'}

  // if we have a cursor add it to the query
  if (cursor) {
    query.cursor = cursor
  }

  // read the namespace
  data.get(query, function _get(err, page) {
    
    // bubble any errors
    if (err) throw err
    
    // log the docs
    console.log(page.docs)

    // continue reading if there's another page
    if (page.cursor) {
      read(cursor)
    }
  })
}

// start reading..
read()
```

Batch read by passing an array of objects. With these building blocks you can construct secondary indexesand joins like one-to-many and many-to-many.

```javascript
data.get([
  {ns:'tacos', key:'carnitas'},
  {ns:'tacos', key:'al-pastor'},
], console.log)
```


#### Deletes

Delete a document by key.

```javascript
data.del({
  ns: 'tacos', 
  key: 'pollo'
}, console.log)
```

Batch delete documents by passinng an array of objects.

```javascript
data.del([
  {ns:'tacos', key:'carnitas'},
  {ns:'tacos', key:'al-pastor'},
], console.log)

```


## Additional Superpowers

- Documents can be expired by setting `ttl` to an UNIX epoch in the future.
- Atomic counters: `data.incr` and `data.decr`


## Patterns

Coming soon! Detailed guides for various data persistence tasks:

- denormalizing
- pagination
- counters
- hashids
- secondary indexes
- one to many
- many to many
