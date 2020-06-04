let aws = require('aws-sdk')
let https = require('https')

/**
 * Instantiates Dynamo service interfaces
 */
function getDynamo (type, callback) {
  if (!type) throw ReferenceError('Must supply Dynamo service interface type')

  let testing = process.env.NODE_ENV === 'testing'
  let port = process.env.ARC_TABLES_PORT || 5000
  let local = {
    endpoint: new aws.Endpoint(`http://localhost:${port}`),
    region: process.env.AWS_REGION || 'us-west-2' // Do not assume region is set!
  }
  let DB = aws.DynamoDB
  let Doc = aws.DynamoDB.DocumentClient
  let dynamo // Assigned below

  function updateConfig () {
    let agent = new https.Agent({
      keepAlive: true,
      maxSockets: 50,
      rejectUnauthorized: true,
    })
    aws.config.update({
      httpOptions: { agent }
    })
    // TODO? migrate to using `AWS_NODEJS_CONNECTION_REUSE_ENABLED`?
  }

  if (type === 'db') {
    if (!testing) {
      updateConfig()
    }
    dynamo = testing
      ? new DB(local)
      : new DB
  }

  if (type === 'doc') {
    if (!testing) {
      updateConfig()
    }
    dynamo = testing
      ? new Doc(local)
      : new Doc
  }

  callback(null, dynamo)
}

module.exports = {
  db: getDynamo.bind({}, 'db'),
  doc: getDynamo.bind({}, 'doc'),
}
