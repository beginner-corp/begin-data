if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'testing'
}

var aws = require('aws-sdk')
var Doc = aws.DynamoDB.DocumentClient
var endpoint = new aws.Endpoint('http://localhost:5000')
var testing = process.env.NODE_ENV === 'testing'

if (testing) {
  aws.config.update({
    region: 'us-west-1'
  })
}

module.exports = testing? new Doc({endpoint}) : new Doc

