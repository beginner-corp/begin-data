/**
 * @private
 * @module DynamoDB.DocumentClient
 */
let aws = require('aws-sdk')

module.exports = function getDB(callback) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'testing'
  }

  let Doc = aws.DynamoDB.DocumentClient
  let port = process.env.ARC_TABLES_PORT || 5000
  let endpoint = new aws.Endpoint(`http://localhost:${port}`)
  let testing = process.env.NODE_ENV === 'testing'
  let region = 'us-west-2'

  callback(null, testing ? new Doc({endpoint, region}) : new Doc)
}
