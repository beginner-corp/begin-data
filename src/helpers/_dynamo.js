let https = require('https')
let getPorts = require('./_get-ports')
let isNode18 = require('./_is-node-18')
let db, doc

/**
 * Instantiates Dynamo service interfaces
 */
function getDynamo (type, callback) {

  let { ARC_ENV, AWS_REGION, ARC_LOCAL } = process.env

  if (db && type === 'db') {
    return callback(null, db)
  }

  if (doc && type === 'doc') {
    return callback(null, doc)
  }

  let DB, Doc
  if (isNode18) {
    let dynamo = require('@aws-sdk/client-dynamodb')
    let docclient = require('@aws-sdk/lib-dynamodb')
    DB = dynamo.DynamoDB
    Doc = docclient.DynamoDBDocument
  }
  else {
    let dynamo = require('aws-sdk/clients/dynamodb')
    DB = dynamo
    Doc = dynamo.DocumentClient
  }

  let local = ARC_ENV === 'testing' || ARC_LOCAL
  if (!local) {
    let config = {
      agent: new https.Agent({
        keepAlive: true,
        maxSockets: 50, // Node can set to Infinity; AWS maxes at 50
        rejectUnauthorized: true,
      })
    }
    db = isNode18 ? new DB : new DB(config)
    doc = isNode18 ? Doc.from(db) : new Doc(config)
    return callback(null, type === 'db' ? db : doc)
  }
  else {
    getPorts((err, ports) => {
      if (err) callback(err)
      else {
        let port = ports.tables
        if (!port) {
          return callback(ReferenceError('Sandbox tables port not found'))
        }
        let config = {
          endpoint: `http://localhost:${port}`,
          region: AWS_REGION || 'us-west-2' // Do not assume region is set!
        }
        db = new DB(config)
        doc = isNode18 ? Doc.from(db) : new Doc(config)
        return callback(null, type === 'db' ? db : doc)
      }
    })
  }
}

module.exports = {
  db: getDynamo.bind({}, 'db'),
  doc: getDynamo.bind({}, 'doc'),
}
