let getPorts = require('./_get-ports')
let util = require('util')
let awsLite = require('@aws-lite/client')
let aws = util.callbackify(awsLite)
let db = false

/**
 * Instantiates Dynamo service interfaces
 */
module.exports = function getDynamo (callback) {

  let { ARC_ENV, AWS_REGION, ARC_LOCAL } = process.env

  if (db) return callback(null, db)

  let local = ARC_ENV === 'testing' || ARC_LOCAL
  if (!local) {
    aws(function gotClient (err, { ddb }) {
      if (err) callback(err)
      else {
        db = ddb
        callback(null, db)
      }
    })
  }
  else {
    getPorts(function gotPorts (err, ports) {
      if (err) callback(err)
      else {
        let port = ports.tables
        if (!port) {
          return callback(ReferenceError('Sandbox tables port not found'))
        }
        aws({
          debug: true,
          protocol: 'http',
          host: 'localhost',
          port,
          region: AWS_REGION || 'us-west-2'
        },
        function gotClient (err, { dynamodb }) {
          if (err) callback(err)
          else {
            db = dynamodb
            callback(null, db)
          }
        })
      }
    })
  }
}
