let doc = require('@architect/data')._doc
let getTableName = require('../_get-table-name')
let getKey = require('../_get-key')
let unfmt = require('../_unfmt')

module.exports = function one(params, callback) {
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
  let TableName = getTableName()
  let Key = getKey(params)
  doc.get({
    TableName,
    Key
  },
  function _get(err, result) {
    if (err) callback(err)
    else callback(null, unfmt(result.Item))
  })
  // more fun
  return promise
}
