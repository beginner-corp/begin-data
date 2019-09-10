/**
 * @private
 * @module set/batch
 */
let waterfall = require('run-waterfall')
let parallel = require('run-parallel')

let getTableName = require('../_get-table-name')
let createKey = require('../_create-key')
let validate = require('../_validate')
let unfmt = require('../_unfmt')
let fmt = require('../_fmt')
let doc = require('../_get-doc')

/**
 * Write an array of documents
 * @param {array} params - The [{table, key}] of documents to write
 * @param {callback} errback - Node style error first callback
 */
module.exports = function batch(params, callback) {

  if (params.length > 25)
    throw Error(`Batch too large; max 25, received ${params.length}`)

  validate.table(params)
  // TODO validate.key accept an array (ignoring items without keys)

  waterfall([
    function getKeys(callback) {
      maybeAddKeys(params, callback)
    },
    function getsTableName(items, callback) {
      getTableName(function done(err, TableName) {
        if (err) callback(err)
        else callback(null, TableName, items)
      })
    },
    function writeKeys(TableName, items, callback) {
      validate.size(items)
      let batch = items.map(Item=> ({PutRequest:{Item}}))
      let query = {RequestItems:{}}
      query.RequestItems[TableName] = batch
      doc.batchWrite(query, function done(err) {
        if (err) callback(err)
        else {
          let clean = item=> unfmt(item.PutRequest.Item)
          callback(null, batch.map(clean))
        }
      })
    },
  ], callback)
}

function maybeAddKeys(params, callback) {
  let fns = params.map(item=> {
    return function ensureKey(callback) {
      if (item.key) callback(null, fmt(item))
      else {
        createKey(item.table, function _createKey(err, key) {
          if (err) callback(err)
          else {
            item.key = key
            callback(null, fmt(item))
          }
        })
      }
    }
  })
  parallel(fns, callback)
}
