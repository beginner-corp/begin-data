let {_doc} = require('@architect/data')

module.exports = function get(params, callback) {
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function _errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }
  let env = process.env.NODE_ENV === 'testing'? 'staging' : process.env.NODE_ENV
  let TableName = `begin-${env}-collections`
  let Key = params 
  _doc.get({TableName, Key}, function _get(err, result) {
    if (err) callback(err)
    else callback(null, result.Item)
  })
  return promise
}
