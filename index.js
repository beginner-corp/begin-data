let get = require('./src/get')
let set = require('./src/set')
let destroy = require('./src/destroy')
let page = require('./src/page')

let count = require('./src/count')
let {incr, decr} = require('./src/_atomic-counters')

module.exports = {
  get, 
  set, 
  destroy, 
  page,
  count,
  incr, 
  decr,
}
