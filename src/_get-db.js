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

if (testing) {
  if (!process.env.AWS_SECRET_ACCESS_KEY)
    process.env.AWS_SECRET_ACCESS_KEY = 'xxx'
  if (!process.env.AWS_ACCESS_KEY)
    process.env.AWS_ACCESS_KEY_ID = 'xxx'
  aws.config.update({
    region: 'us-west-1'
  })
}

module.exports = testing? new DB({endpoint}) : new DB
