/**
 * @module get
 */
let one = require('./one')
let batch = require('./batch')
let page = require('./page')

/**
 * Read documents
 * @param {array|object} params - Either {table}, {table, key} or [{table, key}] of documents to read
 * @param {callback} errback - optional Node style error first callback
 * @returns {promise} promise - if no callback is supplied a promise is returned
 */
module.exports = function get (params, callback) {

  // offload actual impl to each function
  if (Array.isArray(params)) {
    return batch(params, callback)
  }
  else if (params['table'] && params['key']) {
    return one(params, callback)
  }
  else if (params['table']) {
    return page(params, callback)
  }
  else {
    throw ReferenceError('Invalid args; expected [{table, key}], {table, key} or {table}')
  }
}
