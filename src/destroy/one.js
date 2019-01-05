/**
 * @private
 * @module destroy/one
 */
let doc = require('../_get-doc')
let getTableName = require('../_get-table-name')
let getKey = require('../_get-key')

/**
 * Destroy a document
 * @param {object} params - The {table, key} of the document to destroy
 * @param {callback} errback - Node style error first callback
 */
module.exports = function one(params, callback) {
  let TableName = getTableName()
  let Key = getKey(params)
  doc.delete({
    TableName,
    Key,
  }, callback)
}
