/**
 * @private
 * @module destroy/one
 */
let util = require('util')
let waterfall = require('run-waterfall')
let getTableName = require('../helpers/_get-table-name')
let getKey = require('../helpers/_get-key')
let dynamo = require('../helpers/_dynamo')

/**
 * Destroy a document
 * @param {object} params - The {table, key} of the document to destroy
 * @param {callback} errback - Node style error first callback
 */
module.exports = function one (params, callback) {
  waterfall([
    getTableName,
    function _dynamo (TableName, callback) {
      dynamo(function done (err, doc) {
        if (err) callback(err)
        else callback(null, TableName, doc)
      })
    },
    function destroys (TableName, doc, callback) {
      let del = util.callbackify(doc.DeleteItem)
      let Key = getKey(params)
      del({
        TableName,
        Key,
      }, callback)
    }
  ], callback)
}
