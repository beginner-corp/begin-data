let one = require('./one')
let batch = require('./batch')

module.exports = function destroy(params, callback) {
  if (!params)
    throw ReferenceError('missing params in arguments')

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
