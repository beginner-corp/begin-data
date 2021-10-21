let _get = require('./get')
let _set = require('./set')
let _destroy = require('./destroy')
let _page = require('./page')
let _count = require('./count')
let _incr = require('./incr')
let _decr = require('./decr')

/**
 * instantiate a begin/data client scoped to a table
 * example
 *
 *  const cats = new Table('cats')
 */
module.exports = class Table {

  /**
   * @param {string} name
   */
  constructor (name) {
    this.name = name
  }

  async get (args) {
    let params = addTable(args, this.name)
    let result = await _get.call({}, params)
    return removeTable(result)
  }

  async set (args) {
    let params = addTable(args, this.name)
    let result = await _set.call({}, params)
    return removeTable(result)
  }

  async destroy (args) {
    let params = addTable(args, this.name)
    let result = await _destroy.call({}, params)
    return removeTable(result)
  }

  async page (args) {
    let params = addTable(args, this.name)
    let result = await _page.call({}, params)
    return removeTable(result)
  }

  async count (args) {
    let params = addTable(args, this.name)
    let result = await _count.call({}, params)
    return removeTable(result)
  }

  async incr (args) {
    let params = addTable(args, this.name)
    let result = await _incr.call({}, params)
    return removeTable(result)
  }

  async decr (args) {
    let params = addTable(args, this.name)
    let result = await _decr.call({}, params)
    return removeTable(result)
  }
}

function addTable (args, name) {
  let params
  if (Array.isArray(args)) {
    params = args.slice(0).map(function (param) {
      params.table = name
      return param
    })
  }
  else {
    params = { ...args }
    params.table = name
  }
  return params
}

function removeTable (result) {
  if (Array.isArray(result)) {
    let returns = result.slice(0).map(function (r) {
      delete r.table
      return r
    })
    if (result.cursor)
      returns.cursor = result.cursor
    return returns
  }
  else {
    delete result.table
    return result
  }
}
