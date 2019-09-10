/**
 * @private
 * @module get/batch
 */
let waterfall = require('run-waterfall')
let getTableName = require('../_get-table-name')
let getKey = require('../_get-key')
let unfmt = require('../_unfmt')
let doc = require('../_get-doc')

let badKey = i=> !(i.hasOwnProperty('table') && i.hasOwnProperty('key'))

/**
 * Read an array of documents
 * @param {array} params - The [{table, key}] of documents to read
 * @param {callback} errback - Node style error first callback
 */
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
    callback(Error('Invalid params: all items must have table and key'))
  }
  else {
    waterfall([
      getTableName,
      function gets(table, callback) {
        let query = {RequestItems:{}}
        query.RequestItems[table] = {Keys: Keys.map(getKey)}
        doc.batchGet(query, function gots(err, result) {
          if (err) callback(err)
          else {
            callback(null, result.Responses[table].map(unfmt))
          }
        })
      }
    ], callback)
  }
  // more fun
  return promise
}
