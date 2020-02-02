/**
 * @private
 * @module destroy/batch
 */
let waterfall = require('run-waterfall')
let getTableName = require('../_get-table-name')
let getKey = require('../_get-key')
let doc = require('../_get-doc')

/**
 * Destroy an array of documents
 * @param {array} params - The [{table, key}] of documents to destroy
 * @param {callback} errback - Node style error first callback
 */
module.exports = function batch(params, callback) {

  // ensure we have tables and keys
  let hasBads = params.some(i=> !i['table'] || !i['key'])
  if (hasBads)
    throw ReferenceError('Missing table in params')

  // do batch
  waterfall([
    getTableName,
    function destroys(TableName, callback) {
      let req = Key=> ({DeleteRequest: {Key}})
      let batch = params.map(getKey).map(req)
      let query = {RequestItems:{}}
      query.RequestItems[TableName] = batch
      doc.batchWrite(query, callback)
    }
  ],
  function destroyed(err) {
    if (err) callback(err)
    else callback()
  })
}
