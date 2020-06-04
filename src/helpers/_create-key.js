/**
 * @private
 * @module createKey
 */
let waterfall = require('run-waterfall')
let getTableName = require('./_get-table-name')
let dynamo = require('./_dynamo').db
let Hashids = require('@begin/hashid')
let hash = new Hashids

module.exports = function createKey (table, callback) {
  waterfall([
    getTableName,
    function _dynamo (TableName, callback) {
      dynamo(function done (err, db) {
        if (err) callback(err)
        else callback(null, TableName, db)
      })
    },
    function update (TableName, db, callback) {
      db.updateItem({
        TableName,
        Key: {
          'scopeID': { S: process.env.BEGIN_DATA_SCOPE_ID || process.env.ARC_APP_NAME || 'sandbox' },
          'dataID': { S: `${table}-seq` }
        },
        AttributeUpdates: {
          idx: {
            Action: 'ADD',
            Value: { N: '1' }
          }
        },
        ReturnValues: 'UPDATED_NEW'
      }, callback)
    }
  ],
  function done (err, result) {
    if (err) callback(err)
    else {
      let epoc = Date.now() - 1544909702376 // hbd
      let seed = Number(result.Attributes.idx.N)
      let val = hash.encode([ epoc, seed ])
      callback(null, val)
    }
  })
}
