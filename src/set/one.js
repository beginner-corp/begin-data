/**
 * @private
 * @module set/one
 */
let doc = require('../_get-doc')
let fmt = require('../_fmt')
let unfmt = require('../_unfmt')
let getTableName = require('../_get-table-name')
let waterfall = require('run-waterfall')
let createKey = require('../_create-key')
let validate = require('../_validate')

/**
 * Write a document
 * @param {object} params - The document to write
 * @param {callback} errback - Node style error first callback
 */
module.exports = function one(params, callback) {
  validate.table(params.table)
  if (params.key)
    validate.key(params.key)
  waterfall([
    function getKey(callback) {
      maybeCreateKey(params, callback)
    },
    function write(Item, callback) {
      validate.size(Item)
      doc.put({
        TableName: getTableName(),
        Item
      },
      function done(err) {
        if (err) callback(err)
        else callback(null, unfmt(Item))
      })
    }
  ], callback)
}

function maybeCreateKey(params, callback) {
  if (params.key) {
    callback(null, fmt(params))
  }
  else {
    createKey(params.table, function _createKey(err, key) {
      if (err) callback(err)
      else {
        params.key = key
        callback(null, fmt(params))
      }
    })
  }
}
