let util = require('util')
let awsLite = require('@aws-lite/client')
let aws = util.callbackify(awsLite)
let toLogicalID = require('./_to-logical-id')
let getPorts = require('./_get-ports')
let tablename = false

module.exports = function getTableName (callback) {
  let { ARC_APP_NAME: app, ARC_ENV, ARC_STACK_NAME, AWS_REGION, BEGIN_DATA_TABLE_NAME } = process.env

  if (BEGIN_DATA_TABLE_NAME) {
    return callback(null, BEGIN_DATA_TABLE_NAME)
  }

  // Use cached value
  if (tablename) {
    return callback(null, tablename)
  }

  let local = ARC_ENV === 'testing'
  if (!local && !app) {
    return callback(ReferenceError('ARC_APP_NAME env var not found'))
  }
  if (local && !app) {
    app = 'arc-app'
  }
  let stack = ARC_STACK_NAME || toLogicalID(`${app}-${ARC_ENV}`)
  let Name = `/${stack}/tables/data`

  if (local) {
    getPorts((err, ports) => {
      if (err) callback(err)
      else go({
        protocol: 'http',
        host: 'localhost',
        port: ports._arc,
        pathPrefix: '_arc/ssm',
        region: AWS_REGION || 'us-west-2',
      })
    })
  }
  else {
    go()
  }

  function go (config = {}) {
    let plugins = [ import('@aws-lite/ssm') ]
    aws({ plugins, ...config }, function gotClient (err, client) {
      if (err) callback(err)
      else {
        let { ssm } = client
        let getParameter = util.callbackify(ssm.GetParameter)
        getParameter({ Name }, function done (err, result) {
          // let ssm = new SSM(config)
          // ssm.getParameter({ Name }, function done (err, result) {
          if (err) callback(err)
          else {
            let table = result.Parameter
            if (!table) {
              callback(ReferenceError('@begin/data requires a table named data'))
            }
            else {
              tablename = table.Value
              callback(null, tablename)
            }
          }
        })
      }
    })
  }
}
