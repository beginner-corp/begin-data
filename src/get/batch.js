/**
 * @private
 * @module get/batch
 */
let util = require('util')
let waterfall = require('run-waterfall')
let getTableName = require('../helpers/_get-table-name')
let getKey = require('../helpers/_get-key')
let unfmt = require('../helpers/_unfmt')
let dynamo = require('../helpers/_dynamo')

let badKey = i => !(i['table'] && i['key'])

/**
 * Read an array of documents
 * @param {array} params - The [{table, key}] of documents to read
 * @param {callback} errback - Node style error first callback
 */
module.exports = function batch (Keys, callback) {
  // boilerplague
  let promise
  if (!callback) {
    promise = new Promise(function (res, rej) {
      callback = function _errback (err, result) {
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
      function _dynamo (TableName, callback) {
        dynamo(function done (err, doc) {
          if (err) callback(err)
          else callback(null, TableName, doc)
        })
      },
      function gets (table, doc, callback) {
        let batchGet = util.callbackify(doc.BatchGetItem)
        let query = { RequestItems: {} }
        query.RequestItems[table] = { Keys: Keys.map(getKey) }
        batchGet(query, function gots (err, result) {
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
