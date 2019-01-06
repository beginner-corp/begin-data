/**
 * @private
 * @module createKey
 */
let getTableName = require('./_get-table-name')
let db = require('./_get-db')
let Hashids = require('hashids')
let hash = new Hashids

module.exports = function createKey(table, callback) {
  db.updateItem({
    TableName: getTableName(),
    Key:{
      'scopeID': {S: process.env.BEGIN_DATA_SCOPE_ID || process.env.ARC_APP_NAME || 'sandbox'},
      'dataID': {S: `${table}-seq`}
    },
    AttributeUpdates: {
      idx: {
        Action: 'ADD',
        Value: {N: '1'}
      }
    },
    ReturnValues: 'UPDATED_NEW'
  },
  function done(err, result) {
    if (err) callback(err)
    else {
      let epoc = Date.now() - 1544909702376 // hbd
      let seed = Number(result.Attributes.idx.N)
      let val = hash.encode([epoc, seed])
      callback(null, val)
    }
  })
}
