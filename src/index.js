/**
 * Ensure env is one of: 'testing', 'staging', or 'production'
 * If in Sandbox, meet version requirements
 */
let { ARC_ENV } = process.env
let validEnvs = [ 'testing', 'staging', 'production' ]
// Backfill ARC_ENV if Data is running outside of Sandbox in a test suite
if (!ARC_ENV) {
  process.env.ARC_ENV = ARC_ENV = 'testing'
}
if (!validEnvs.includes(ARC_ENV)) {
  throw ReferenceError(`ARC_ENV env var is required for use with @begin/data`)
}


let get = require('./get')
let set = require('./set')
let destroy = require('./destroy')
let page = require('./page')
let count = require('./count')
let { incr, decr } = require('./helpers/_atomic-counters')

module.exports = {
  get,
  set,
  destroy,
  page,
  count,
  incr,
  decr,
}
