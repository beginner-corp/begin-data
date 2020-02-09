/**
 * @private
 * @module DynamoDB
 */
if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'testing'
}

let aws = require('aws-sdk')
let DB = aws.DynamoDB
let port = process.env.ARC_TABLES_PORT || 5000
let endpoint = new aws.Endpoint(`http://localhost:${port}`)
let testing = process.env.NODE_ENV === 'testing'
let region = 'us-west-2'

module.exports = testing? new DB({endpoint, region}) : new DB
