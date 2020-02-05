/**
 * @private
 * @module DynamoDB.DocumentClient
 */
if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'testing'
}

let aws = require('aws-sdk')
let Doc = aws.DynamoDB.DocumentClient
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

module.exports = testing? new Doc({endpoint}) : new Doc
