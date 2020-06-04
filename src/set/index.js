/**
 * @module set
 */
let batch = require('./batch')
let one = require('./one')

/**
 * Write documents
 * @param {array|object} params - Either {table}, {table, key} or [{table, key}] of document(s) to write
 * @param {callback} errback - optional Node style error first callback
 * @returns {promise} promise - if no callback is supplied a promise is returned
 */
module.exports = function set (params, callback) {

  if (!params)
    throw ReferenceError('Missing params')

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
