/**
 * @private
 * @module incr
 * @module decr
 */
let waterfall = require('run-waterfall')
let util = require('util')
let dynamo = require('./_dynamo')
let getTableName = require('./_get-table-name')
let getKey = require('./_get-key')
let unfmt = require('./_unfmt')

let incr = (params, callback) => atomic(true, params, callback)
let decr = (params, callback) => atomic(false, params, callback)

/**
 * atomic incr/decr
 */
module.exports = { incr, decr }

function atomic (isIncr, params, callback) {

  let { table, key, prop } = params
  if (!table) throw ReferenceError('Missing param: table')
  if (!key) throw ReferenceError('Missing param: key')
  if (!prop) throw ReferenceError('Missing param: prop')

  // backfill the async adventure du jour
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
    function _update (TableName, doc, callback) {
      // perform the atomic update and callback w the updated values
      let update = util.callbackify(doc.UpdateItem)
      update({
        TableName,
        Key: getKey({ table, key }),
        UpdateExpression: `SET ${prop} = if_not_exists(${prop}, :zero) ${isIncr ? '+' : '-'} :val`,
        ExpressionAttributeValues: {
          ':val': 1,
          ':zero': 0
        },
        ReturnValues: 'ALL_NEW'
      }, callback)
    }
  ],
  function updated (err, result) {
    if (err) callback(err)
    else {
      callback(null, unfmt(result.Attributes))
    }
  })
  // this is fine
  return promise
}
