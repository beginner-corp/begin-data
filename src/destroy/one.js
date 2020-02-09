/**
 * @private
 * @module destroy/one
 */
let waterfall = require('run-waterfall')
let getTableName = require('../helpers/_get-table-name')
let getKey = require('../helpers/_get-key')
let doc = require('../helpers/_get-doc')

/**
 * Destroy a document
 * @param {object} params - The {table, key} of the document to destroy
 * @param {callback} errback - Node style error first callback
 */
module.exports = function one(params, callback) {
  waterfall([
    getTableName,
    function destroys(TableName, callback) {
      let Key = getKey(params)
      doc.delete({
        TableName,
        Key,
      }, callback)
    }
  ], callback)
}
