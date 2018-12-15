let get = require('./src/get')
let page = require('./src/page')
let count = require('./src/count')
let set = require('./src/set')
let destroy = require('./src/destroy')
let incr = require('./src/incr')
let decr = require('./src/decr')

module.exports = {
  // reads
  get, 
  page,
  count,
  // writes
  set, 
  destroy, 
  incr, 
  decr,
}
