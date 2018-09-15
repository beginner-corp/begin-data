var read = require('./_read')
var write = require('./_write')
var offline = process.env.NODE_ENV === 'testing' && !process.env.hasOwnProperty('ARC_LOCAL')? {} : false
var Hashids = require('hashids')

module.exports = {

  // private accessor for testing
  _offline: offline,

  /**
   * read document(s)
   *
   * params
   *
   * - empty returns namespaces for this app/token
   * - ns: lists the first 1MB of documents in the namespace and optionally a cursor
   * - key: get a document by key
   *
   */
  get(params, callback) {

    var promise
    if (!callback) {
      promise = new Promise(function(res, rej) {
        callback = function _errback(err, result) {
          err ? rej(err) : res(result)
        }
      })
    }

    if (offline && Array.isArray(params)) {
      var result = params.map(kv=> offline[kv.ns].find(a=> a.key === kv.key))
      callback(null, {docs: result})
    }
    else if (offline && params.ns && params.key) {
      var v = offline[params.ns].find(a=> a.key === params.key)
      callback(null, v) 
    }
    else if (offline && params.ns) {
      callback(null, {docs: offline[params.ns]}) 
    }
    else if (offline) {
      callback(null, {namespaces: Object.keys(offline)})
    }
    else {
      read(params, callback)
    }

    return promise
  },

  /**
   * write document(s)
   *
   * params
   *
   * - ns (always required)
   * - key (optional, if not present a key is generated)
   *
   *   or
   *
   * - an array of [{ns}, {ns, key} ...]
   *
   */
  set(params, callback) {
    
    var isBatch = Array.isArray(params)
    
    if (!params.ns && !isBatch) {
      throw ReferenceError('missing ns')
    }

    if (isBatch) {
      var badNs = params.filter(p=> !p.hasOwnProperty('ns')).length > 0
      if (badNs) 
        throw ReferenceError('batch set element is missing ns')
    }

    var promise
    if (!callback) {
      promise = new Promise(function(res, rej) {
        callback = function _errback(err, result) {
          err ? rej(err) : res(result)
        }
      })
    }

    if (offline) {
      function one(params) {
        var copy = {...params}
        var ns = copy.ns
        var key = copy.key
        // create the ns if it does not exist
        if (!offline[ns]) 
          offline[ns] = []
        // create the key if it does not exist
        if (!key)
          key = copy.key = (new Hashids()).encode(Date.now(), ~~(Math.random()*10))
        // purge olds
        offline[ns] = offline[ns].filter(r=> r.key != key)
        // save the new record
        offline[ns].push(copy)
        return copy
      }
      var result = isBatch? {docs: params.map(one)} : one(params)
      callback(null, result)
    }
    else {
      write('', params, callback)
    }

    return promise
  },

  /**
   * delete document(s)
   * 
   * params
   *
   * - ns (required)
   * - key (required)
   *
   *   or
   *   
   * - an array of [{ns, key}, {ns, key}]
   *
   */
  del(params, callback) {
    // validate 
    if (Array.isArray(params)) {
      var badNs = params.filter(p=> !p.hasOwnProperty('ns')).length > 0
      var badKey = params.filter(p=> !p.hasOwnProperty('key')).length > 0
      if (badNs || badKey)
        throw ReferenceError('batch delete elementing missing ns or key')
    }
    else {
      if (!params.ns)
        throw ReferenceError('missing ns')
      if (!params.key)
        throw ReferenceError('missing key')
    }
    var promise
    if (!callback) {
      promise = new Promise(function(res, rej) {
        callback = function _errback(err, result) {
          err ? rej(err) : res(result)
        }
      })
    }
    // perform write
    if (offline && !Array.isArray(params)) {
      offline[params.ns] = offline[params.ns].filter(a=> a.key != params.key)
      callback(null, {deleted: true})
    }
    else if (offline) {
      params.forEach(p=> {
        offline[p.ns] = offline[p.ns].filter(a=> a.key != p.key)
      })
      callback(null, {deleted: true})
    }
    else {
      write('del', params, callback)
    }
    return promise
  },

  incr(params, callback) {
    if (!params.key)
      throw ReferenceError('key required')
    if (!params.ns) 
      throw ReferenceError('ns required')
    var promise
    if (!callback) {
      promise = new Promise(function(res, rej) {
        callback = function _errback(err, result) {
          err ? rej(err) : res(result)
        }
      })
    }
    if (offline) {
      var ns = params.ns
      var key = params.key
      var attr = params.attr || 'count'
      // ns default
      if (!offline[ns])
        offline[ns] = []
      var doc = offline[ns].find(a=> a.key === key)
      // doc default
      if (!doc)
        doc = {ns, key}
      // zero default
      if (!doc.hasOwnProperty(attr)) 
        doc[attr] = 0
      
      // incr, finally
      doc[attr] += 1
      // filter out old record
      offline[ns] = offline[ns].filter(a=> a.key != key)
      // push in new record
      offline[ns].push(doc)
      // callback with updated result
      callback(null, doc)
    }
    else {
      write('incr', params, callback)
    }
    return promise
  },

  // FIXME make incr and decr one method
  // FIXME make it check for Number type on attr
  decr(params, callback) {
     if (!params.key)
      throw ReferenceError('key required')
    if (!params.ns) 
      throw ReferenceError('ns required')
    var promise
    if (!callback) {
      promise = new Promise(function(res, rej) {
        callback = function _errback(err, result) {
          err ? rej(err) : res(result)
        }
      })
    }
    if (offline) {
      var ns = params.ns
      var key = params.key
      var attr = params.attr || 'count'
      // ns default
      if (!offline[ns])
        offline[ns] = []
      var doc = offline[ns].find(a=> a.key === key)
      // doc default
      if (!doc)
        doc = {ns, key}
      // zero default
      if (!doc.hasOwnProperty(attr)) 
        doc[attr] = 0
      
      // incr, finally
      doc[attr] -= 1
      // filter out old record
      offline[ns] = offline[ns].filter(a=> a.key != key)
      // push in new record
      offline[ns].push(doc)
      // callback with updated result
      callback(null, doc)
    }
    else {
      write('decr', params, callback)
    }
    return promise
  }
}
