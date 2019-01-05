/**
 * @module count
 */
let doc = require('./_get-doc')
let getKey = require('./_get-key')
let getTableName = require('./_get-table-name')

/**
 * Get document count for given table
 * @param {object} params - The {table} to get the count from
 * @param {callback} errback - optional Node style error first callback
 * @returns {promise} promise - if no callback is supplied a promise is returned
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
