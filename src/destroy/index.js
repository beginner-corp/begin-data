/**
 * @module destroy
 */
let one = require('./one')
let batch = require('./batch')

/**
 * Destroy document(s)
 * @param {array|object} params - Either {table, key} or [{table, key}] of documents to destroy
 * @param {callback} errback - optional Node style error first callback
 * @returns {promise} promise - if no callback is supplied a promise is returned
 */
module.exports = function destroy (params, callback) {
  if (!params)
    throw ReferenceError('Missing params in arguments')

  // backfill the async adventure du jour
  let promise
  if (!callback) {
    promise = new Promise(function (res, rej) {
      callback = function _errback (err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  let exec = Array.isArray(params) ? batch : one
  exec(params, callback)
  return promise
}
