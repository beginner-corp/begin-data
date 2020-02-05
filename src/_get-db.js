/**
 * @private
 * @module DynamoDB
 */
if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'testing'
}

var aws = require('aws-sdk')
var DB = aws.DynamoDB
var endpoint = new aws.Endpoint('http://localhost:5000')
var testing = process.env.NODE_ENV === 'testing'

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
