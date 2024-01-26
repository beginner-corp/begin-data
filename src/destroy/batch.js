/**
 * @private
 * @module destroy/batch
 */
let util = require('util')
let waterfall = require('run-waterfall')
let getTableName = require('../helpers/_get-table-name')
let getKey = require('../helpers/_get-key')
let dynamo = require('../helpers/_dynamo')

/**
 * Destroy an array of documents
 * @param {array} params - The [{table, key}] of documents to destroy
 * @param {callback} errback - Node style error first callback
 */
module.exports = function batch (params, callback) {

  // ensure we have tables and keys
  let hasBads = params.some(i => !i['table'] || !i['key'])
  if (hasBads)
    throw ReferenceError('Missing table in params')

  // do batch
  waterfall([
    getTableName,
    function _dynamo (TableName, callback) {
      dynamo(function done (err, doc) {
        if (err) callback(err)
        else callback(null, TableName, doc)
      })
    },
    function destroys (TableName, doc, callback) {
      let req = Key => ({ DeleteRequest: { Key } })
      let batch = params.map(getKey).map(req)
      let query = { RequestItems: {} }
      query.RequestItems[TableName] = batch
      let batchWrite = util.callbackify(doc.BatchWriteItem)
      batchWrite(query, callback)
    }
  ],
  function destroyed (err) {
    if (err) callback(err)
    else callback()
  })
}
