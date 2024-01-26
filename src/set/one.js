/**
 * @private
 * @module set/one
 */
let waterfall = require('run-waterfall')
let getTableName = require('../helpers/_get-table-name')
let createKey = require('../helpers/_create-key')
let validate = require('../helpers/_validate')
let unfmt = require('../helpers/_unfmt')
let fmt = require('../helpers/_fmt')
let dynamo = require('../helpers/_dynamo')
let util = require('util')

/**
 * Write a document
 * @param {object} params - The document to write
 * @param {callback} errback - Node style error first callback
 */
module.exports = function one (params, callback) {
  validate.table(params.table)
  if (params.key)
    validate.key(params.key)
  waterfall([
    function getKey (callback) {
      maybeCreateKey(params, callback)
    },
    function getTable (Item, callback) {
      getTableName(function done (err, TableName) {
        if (err) callback(err)
        else callback(null, TableName, Item)
      })
    },
    function _dynamo (TableName, Item, callback) {
      dynamo(function done (err, doc) {
        if (err) callback(err)
        else callback(null, TableName, Item, doc)
      })
    },
    function write (TableName, Item, doc, callback) {
      validate.size(Item)
      let put = util.callbackify(doc.PutItem)
      put({
        TableName,
        Item
      },
      function done (err) {
        if (err) callback(err)
        else callback(null, unfmt(Item))
      })
    }
  ], callback)
}

function maybeCreateKey (params, callback) {
  if (params.key) {
    callback(null, fmt(params))
  }
  else {
    createKey(params.table, function _createKey (err, key) {
      if (err) callback(err)
      else {
        params.key = key
        callback(null, fmt(params))
      }
    })
  }
}
