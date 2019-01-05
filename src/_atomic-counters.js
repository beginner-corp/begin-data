/**
 * @private
 * @module incr
 * @module decr
 */
let doc = require('./_get-doc')
let getTableName = require('./_get-table-name')
let getKey = require('./_get-key')

let incr = (params, callback)=> atomic(true, params, callback)
let decr = (params, callback)=> atomic(false, params, callback)

/**
 * atomic incr/decr
 */
module.exports = {incr, decr}

function atomic(isIncr, params, callback) {

  let {table, key, prop} = params
  if (!table) throw ReferenceError('Missing param: table')
  if (!key) throw ReferenceError('Missing param: key')
  if (!prop) throw ReferenceError('Missing param: prop')

  // backfill the async adventure du jour
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function _errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }
  // perform the atomic update and callback w the updated values
  doc.update({
    TableName: getTableName(),
    Key: getKey({table, key}),
    UpdateExpression: `set ${prop} = ${prop} ${isIncr?'+':'-'} :val`,
    ExpressionAttributeValues:{
      ':val': 1
    },
    ReturnValues: 'ALL_NEW'
  },
  function update(err, result) {
    if (err) callback(err)
    else {
      callback(null, result.Attributes)
    }
  })
  // this is fine
  return promise
}
