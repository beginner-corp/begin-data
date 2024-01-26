/**
 * @private
 * @module createKey
 */
let waterfall = require('run-waterfall')
let getTableName = require('./_get-table-name')
let dynamo = require('./_dynamo')
let Hashids = require('@begin/hashid')
let util = require('util')
let hash = new Hashids

module.exports = function createKey (table, callback) {
  let { ARC_APP_NAME = 'sandbox', BEGIN_DATA_SCOPE_ID } = process.env
  waterfall([
    getTableName,
    function _dynamo (TableName, callback) {
      dynamo(function done (err, db) {
        if (err) callback(err)
        else callback(null, TableName, db)
      })
    },
    function update (TableName, db, callback) {
      let updateItem = util.callbackify(db.UpdateItem)
      let query = {
        TableName,
        Key: {
          'scopeID': BEGIN_DATA_SCOPE_ID || ARC_APP_NAME,
          'dataID': `${table}-seq`
        },
        UpdateExpression: `SET idx = if_not_exists(idx, :one) + :one`,
        ExpressionAttributeValues: {
          ':one': 1
        },
        ReturnValues: 'ALL_NEW'
      }
      updateItem(query, callback)
    }
  ],
  function done (err, result) {
    if (err) callback(err)
    else {
      let epoc = Date.now() - 1544909702376 // hbd
      let seed = Number(result.Attributes.idx)
      let val = hash.encode([ epoc, seed ])
      callback(null, val)
    }
  })
}
