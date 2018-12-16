let doc = require('@architect/data')._doc
let Hashids = require('hashids')
let hashids = new Hashids
let createKey = ()=> (hashids.encode(Date.now()-1544909702376, Math.random()))

function maybeCreateKey(item) {
  if (!item.hasOwnProperty('key'))
    item.key = createKey()
  return item
}

/**
 * set a key/value or batch set an array of key/values
 */
module.exports = function set(params, callback) {

  if (!params)
    throw ReferenceError('missing params in arguments')

  // backfill the async adventure du jour
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function _errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  let env = process.env.NODE_ENV === 'testing'? 'staging' : process.env.NODE_ENV
  let TableName = `begin-${env}-collections` 

  // batch! 
  if (Array.isArray(params)) {

    // ensure we have tables
    let hasBads = params.some(i=> !i.hasOwnProperty('table'))
    if (hasBads)
      throw ReferenceError('missing table in params')

    // do batch
    let batch = params.map(maybeCreateKey).map(Item=> ({PutRequest:{Item}}))
    let query = {RequestItems:{}}
    query.RequestItems[TableName] = batch

    console.log(JSON.stringify(query, null, 2))

    doc.batchWrite(query, function _batchWrite(err, result) {
      if (err) callback(err)
      else {
        let clean = item=> item.PutRequest.Item
        callback(null, batch.map(clean))
      }
    })
  }
  else {

    if (!params.table)
      throw ReferenceError('missing params.table')

    if (!params.key)
      params.key = createKey() 


    doc.put({
      TableName, 
      Item: params
    }, 
    function _put(err, result) {
      if (err) callback(err)
      else callback(null, params)
    })
  }

  return promise
}
