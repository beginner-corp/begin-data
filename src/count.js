let doc = require('@architect/data')._doc
let getKey = require('./_get-key')
let getTableName = require('./_get-table-name')

/**
 * get item count for given table
 */
module.exports = function count({table}, callback) {
  if (!table)
    throw ReferenceError('Missing params.table')
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function _errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }
  let {scopeID, dataID} = getKey({table, key:'UNKNOWN'})
  //console.log({scopeID, dataID})
  doc.query({
    TableName: getTableName(),
    Select: 'COUNT',
    KeyConditionExpression: '#scopeID = :scopeID and begins_with(#dataID, :dataID)',
    ExpressionAttributeNames: {
      '#scopeID': 'scopeID',
      '#dataID': 'dataID'
    },
    ExpressionAttributeValues: {
      ':scopeID': scopeID,
      ':dataID': dataID.replace('#UNKNOWN', ''),
    }
  },
  function _query(err, result) {
    if (err) callback(err)
    else {
      callback(null, result.ScannedCount)
    }
  })
  return promise
}
