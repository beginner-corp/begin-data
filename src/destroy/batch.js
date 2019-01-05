/**
 * @private
 * @module destroy/batch
 */
let doc = require('../_get-doc')
let getTableName = require('../_get-table-name')
let getKey = require('../_get-key')

/**
 * Destroy an array of documents
 * @param {array} params - The [{table, key}] of documents to destroy
 * @param {callback} errback - Node style error first callback
 */
module.exports = function batch(params, callback) {

  // ensure we have tables and keys
  let hasBads = params.some(i=> !i.hasOwnProperty('table') || !i.hasOwnProperty('key'))
  if (hasBads)
    throw ReferenceError('Missing table in params')

  // do batch
  let TableName = getTableName()
  let req = Key=> ({DeleteRequest: {Key}})
  let batch = params.map(getKey).map(req)
  let query = {RequestItems:{}}
  query.RequestItems[TableName] = batch

  doc.batchWrite(query, function _batchWrite(err) {
    if (err) callback(err)
    else callback()
  })
}
