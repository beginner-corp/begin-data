let getTableName = require('./_get-table-name')
let db = require('./_get-db')
let Hashids = require('hashids')
let hash = new Hashids

module.exports = function createKey(table, callback) {
  db.updateItem({
    TableName: getTableName(),
    Key:{
      'scopeID': {S: '_seq'},
      'dataID': {S: table}
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
