let aws = require('aws-sdk')
let https = require('https')

/**
 * Instantiates Dynamo service interfaces
 */
function getDynamo (type, callback) {
  if (!type) throw ReferenceError('Must supply Dynamo service interface type')
  let { ARC_ENV, ARC_SANDBOX, AWS_REGION } = process.env

  let testing = ARC_ENV === 'testing'
  let local
  if (testing) {
    let { ports } = JSON.parse(ARC_SANDBOX)
    let port = ports.tables
    local = {
      endpoint: new aws.Endpoint(`http://localhost:${port}`),
      region: AWS_REGION || 'us-west-2' // Do not assume region is set!
    }
  }
  let DB = aws.DynamoDB
  let Doc = aws.DynamoDB.DocumentClient
  let dynamo // Assigned below

  if (!testing) {
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
    dynamo = testing
      ? new DB(local)
      : new DB
  }

  if (type === 'doc') {
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
