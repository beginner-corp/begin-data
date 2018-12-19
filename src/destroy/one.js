let doc = require('@architect/data')._doc
let getTableName = require('../_get-table-name')
let getKey = require('../_get-key')

module.exports = function one(params, callback) {
  let TableName = getTableName()
  let Key = getKey(params)
  doc.delete({
    TableName,
    Key,
  }, callback)
}
