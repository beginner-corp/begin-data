let batch = require('./batch')
let one = require('./one')

/**
 * set a key/value or batch set an array of key/values
 */
module.exports = function set(params, callback) {

  if (!params)
    throw ReferenceError('Missing params')

  // backfill the async adventure du jour
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function _errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  let exec = Array.isArray(params)? batch : one
  exec(params, callback)
  return promise
}
