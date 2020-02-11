/**
 * @private
 * @module destroy/one
 */
let waterfall = require('run-waterfall')
let getTableName = require('../helpers/_get-table-name')
let getKey = require('../helpers/_get-key')
let getDoc = require('../helpers/_get-doc')

/**
 * Destroy a document
 * @param {object} params - The {table, key} of the document to destroy
 * @param {callback} errback - Node style error first callback
 */
module.exports = function one(params, callback) {
  waterfall([
    getTableName,
    function _getDoc(TableName, callback) {
      getDoc(function done(err, doc) {
        if (err) callback(err)
        else callback(null, TableName, doc)
      })
    },
    function destroys(TableName, doc, callback) {
      let Key = getKey(params)
      doc.delete({
        TableName,
        Key,
      }, callback)
    }
  ], callback)
}
