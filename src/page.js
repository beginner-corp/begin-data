let get = require('./get')

/**
 * paginate a table
 *
 * @param {Object} props
 * @param {string} props.table
 * @param {number} props.limit
 * @returns {asyncIterable}
 */
module.exports = function page (props) {
  if (!props.table) {
    throw ReferenceError('Missing params.table')
  }

  let cursor = false
  let finished = false

  function next () {
    // signal completion
    if (finished) {
      return {
        done: true
      }
    }

    // copy in props each invocation (limit and table)
    let params = { ...props }

    // if the cursor is truthy add that value to params
    if (cursor)
      params.cursor = cursor

    return new Promise(function sigh (resolve, reject) {
      get(params, function got (err, result) {
        if (err) {
          reject(err)
        }
        else if (result && result.cursor) {
          cursor = result.cursor
          resolve({ value: result, done: false })
        }
        else {
          finished = true // important! and weird yes. we'll miss the last page otherwise
          resolve({ value: result, done: false })
        }
      })
    })
  }

  // yay
  let asyncIterator = { next }
  let asyncIterable = {
    [Symbol.asyncIterator]: () => asyncIterator
  }
  return asyncIterable
}
