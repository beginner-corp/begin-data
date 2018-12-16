let data = require('@architect/data')
let Hashids = require('hashids')
let hashids = new Hashids

module.exports = function count({table}, callback) {
  if (!table)
    throw ReferenceError('missing params.table')
  let promise
  if (!callback) {
    promise = new Promise(function(res, rej) {
      callback = function _errback(err, result) {
        err ? rej(err) : res(result)
      }
    })
  }
  let env = process.env.NODE_ENV === 'testing'? 'staging' : process.env.NODE_ENV
  let TableName = `begin-${env}-collections`
  data._doc.query({
    TableName,
    Select: 'COUNT',
    KeyConditionExpression: '#table = :table',
    ExpressionAttributeNames: {
      '#table': 'table'
    },
    ExpressionAttributeValues: {
      ':table': table 
    }
  }, 
  function _query(err, result) {
    if (err) callback(err)
    else {
      callback(null, result.ScannedCount)
    }
  })
  return promise
}
