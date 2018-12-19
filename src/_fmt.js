let getKey = require('./_get-key')

module.exports = function(obj) {
  let copy = {...obj, ...getKey(obj)}
  delete copy.key
  delete copy.table
  return copy
}
