let get = require('./src/get')
let set = require('./src/set')
let destroy = require('./src/destroy')
let page = require('./src/page')
let count = require('./src/count')
let incr = require('./src/incr')
let decr = require('./src/decr')
let Table = require('./src/table')

/**
 * instantiate many tables
 *
 * example
 *
 *  let [cats, dogs] = factory('cats', 'dogs')
 */
let factory = (...args) => args.map(name => new Table(name))

module.exports = {
  get,
  set,
  destroy,
  page,
  count,
  incr,
  decr,
  Table,
  factory
}
