/**
 * @private
 * @module get/page
 */
let doc = require('../_get-doc')
let getTableName = require('../_get-table-name')
let getKey = require('../_get-key')
let unfmt = require('../_unfmt')

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

  // actual impl
  params.key = 'UNKNOWN'
  let {scopeID, dataID} = getKey(params)
  let query = {
    TableName: getTableName(),
    Limit: params.limit || 10,
    KeyConditionExpression: '#scopeID = :scopeID and begins_with(#dataID, :dataID)',
    ExpressionAttributeNames: {
      '#scopeID': 'scopeID',
      '#dataID': 'dataID'
    },
    ExpressionAttributeValues: {
      ':scopeID': scopeID,
      ':dataID': dataID.replace('#UNKNOWN', ''),
    }
  }
  if (params.cursor) {
    query.ExclusiveStartKey = JSON.parse(Buffer.from(params.cursor, 'base64').toString('utf8'))
  }
  doc.query(query, function _get(err, result) {
    if (err) callback(err)
    else {
      //console.log(Object.keys(result))
      let returns = result.Items.map(unfmt)
      if (result.LastEvaluatedKey)
        returns.cursor = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      callback(null, returns)
    }
  })

  // more fun
  return promise
}
