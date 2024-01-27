/**
 * @private
 * @module get/page
 */
let waterfall = require('run-waterfall')
let getTableName = require('../helpers/_get-table-name')
let getKey = require('../helpers/_get-key')
let unfmt = require('../helpers/_unfmt')
let dynamo = require('../helpers/_dynamo')
let util = require('util')

/**
 * Read documents
 * @param {object} params - The {table, [cursor]} of documents to read
 * @param {callback} errback - Node style error first callback
 */
module.exports = function page (params, callback) {

  // boilerplague
  let promise
  if (!callback) {
    promise = new Promise(function (res, rej) {
      callback = function _errback (err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  waterfall([
    getTableName,
    function _dynamo (TableName, callback) {
      dynamo(function done (err, doc) {
        if (err) callback(err)
        else callback(null, TableName, doc)
      })
    },
    function pager (TableName, doc, callback) {

      params.key = params.begin || 'UNKNOWN'
      let { scopeID, dataID } = getKey(params)
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
      let runQuery = util.callbackify(doc.Query)
      runQuery(query, callback)
    },
  ],
  function paged (err, result) {
    if (err) callback(err)
    else {
      let exact = item => item.table === params.table
      let returns = result.Items.map(unfmt).filter(exact)
      if (result.LastEvaluatedKey) {
        returns.cursor = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      }
      callback(null, returns)
    }
  })

  return promise
}
