/**
 * @private
 * @module get/one
 */
let waterfall = require('run-waterfall')
let getTableName = require('../helpers/_get-table-name')
let getKey = require('../helpers/_get-key')
let unfmt = require('../helpers/_unfmt')
let dynamo = require('../helpers/_dynamo').doc

/**
 * Read a document
 * @param {object} params - The {table, key} of documents to read
 * @param {callback} errback - Node style error first callback
 */
module.exports = function one (params, callback) {
  // boilerplague
  let promise
  if (!callback) {
    promise = new Promise(function (res, rej) {
      callback = function _errback (err, result) {
        err ? rej(err) : res(result)
      }
    })
  }
  waterfall([
    getTableName,
    function _dynamo (TableName, callback) {
      dynamo(function done (err, doc) {
        if (err) callback(err)
        else callback(null, TableName, doc)
      })
    },
    function gets (TableName, doc, callback) {
      let Key = getKey(params)
      doc.get({
        TableName,
        Key
      }, callback)
    }
  ],
  function gots (err, result) {
    if (err) callback(err)
    else callback(null, unfmt(result.Item))
  })
  // more fun
  return promise
}
