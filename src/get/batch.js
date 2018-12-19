let doc = require('@architect/data')._doc
let getTableName = require('../_get-table-name')
let unfmt = require('../_unfmt')
let getKey = require('../_get-key')
let badKey = i=> !(i.hasOwnProperty('table') && i.hasOwnProperty('key'))

module.exports = function batch(Keys, callback) {
  // boilerplague
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function _errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }
  // fail fast
  if (Keys.some(badKey)) {
    callback(Error('invalid params: all items must have table and key'))
  }
  else {
    let table = getTableName()
    let query = {RequestItems:{}}
    query.RequestItems[table] = {Keys: Keys.map(getKey)}
    doc.batchGet(query, function batchGet(err, result) {
      if (err) callback(err)
      else {
        callback(null, result.Responses[table].map(unfmt))
      }
    })
  }
  // more fun
  return promise
}
