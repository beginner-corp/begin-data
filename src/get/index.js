let one = require('./one')
let batch = require('./batch')
let page = require('./page')

/**
 * get
 * ---
 * get one or many items or paginate an entire table
 *
 *  usage
 *    let result = await data.get({table, key})
 */
module.exports = function get(params, callback) {

  // offload actual impl to each function
  // - we assume batch if we get an array
  // - table and key gets an item or an empty {} if not (should we change to false?)
  // - table alone returns an async iterator for pagination
  if (Array.isArray(params)) {
    return batch(params, callback)
  }
  else if (params.hasOwnProperty('table') && params.hasOwnProperty('key')) {
    return one(params, callback)
  }
  else if (params.hasOwnProperty('table')) {
    return page(params, callback)
  }
  else {
    throw ReferenceError('Invalid args; expected [{table, key}], {table, key} or {table}')
  }
}
