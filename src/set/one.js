/**
 * @private
 * @module set/one
 */
let waterfall = require('run-waterfall')
let getTableName = require('../_get-table-name')
let createKey = require('../_create-key')
let validate = require('../_validate')
let unfmt = require('../_unfmt')
let fmt = require('../_fmt')
let doc = require('../_get-doc')

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
    function getTable(Item, callback) {
      getTableName(function done(err, TableName) {
        if (err) callback(err)
        else callback(null, TableName, Item)
      })
    },
    function write(TableName, Item, callback) {
      validate.size(Item)
      doc.put({
        TableName,
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
