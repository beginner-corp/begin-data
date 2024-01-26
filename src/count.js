/**
 * @module count
 */
let waterfall = require('run-waterfall')
let util = require('util')
let getTableName = require('./helpers/_get-table-name')
let getKey = require('./helpers/_get-key')
let dynamo = require('./helpers/_dynamo')

/**
 * Get document count for given table
 * @param {object} params - The {table} to get the count from
 * @param {callback} errback - optional Node style error first callback
 * @returns {promise} promise - if no callback is supplied a promise is returned
 */
module.exports = function count ({ table }, callback) {
  if (!table) {
    throw ReferenceError('Missing params.table')
  }

  let promise
  if (!callback) {
    promise = new Promise(function (res, rej) {
      callback = function _errback (err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  let { scopeID, dataID } = getKey({ table, key: 'UNKNOWN' })
  waterfall([
    getTableName,
    function _dynamo (TableName, callback) {
      dynamo(function done (err, doc) {
        if (err) callback(err)
        else callback(null, TableName, doc)
      })
    },
    function counts (TableName, doc, callback) {
      let query = util.callbackify(doc.Query)
      query({
        TableName,
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
      }, callback)
    }
  ],
  function counted (err, result) {
    if (err) callback(err)
    else callback(null, result.ScannedCount)
  })

  return promise
}
