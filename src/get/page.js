/**
 * @private
 * @module get/page
 */
let waterfall = require('run-waterfall')
let getTableName = require('../_get-table-name')
let getKey = require('../_get-key')
let unfmt = require('../_unfmt')
let doc = require('../_get-doc')

/**
 * Read documents
 * @param {object} params - The {table, [cursor]} of documents to read
 * @param {callback} errback - Node style error first callback
 */
module.exports = function page(params, callback) {

  // boilerplague
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function _errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  waterfall([
    getTableName,
    function pager(TableName, callback) {
      
      params.key = params.begin || 'UNKNOWN'
      let {scopeID, dataID} = getKey(params)
      dataID = dataID.replace('#UNKNOWN', '')

      let query = {
        TableName,
        Limit: params.limit || 10,
        KeyConditionExpression: '#scopeID = :scopeID and begins_with(#dataID, :dataID)',
        ExpressionAttributeNames: {
          '#scopeID': 'scopeID',
          '#dataID': 'dataID'
        },
        ExpressionAttributeValues: {
          ':scopeID': scopeID,
          ':dataID': dataID,
        }
      }
      if (params.cursor) {
        query.ExclusiveStartKey = JSON.parse(Buffer.from(params.cursor, 'base64').toString('utf8'))
      }
      doc.query(query, callback)
    },
  ],
  function paged(err, result) {
    if (err) callback(err)
    else {
      let returns = result.Items.map(unfmt)
      if (result.LastEvaluatedKey)
        returns.cursor = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      callback(null, returns)
    }
  })

  return promise
}
