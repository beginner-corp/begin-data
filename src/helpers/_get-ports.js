let toLogicalID = require('./_to-logical-id')
let configuredPorts

module.exports = function getPorts (callback) {
  let { ARC_APP_NAME: app, ARC_ENV: env, ARC_SANDBOX, AWS_REGION } = process.env
  let notFound = ReferenceError('Sandbox internal DynamoDB port not found')

  if (configuredPorts) {
    callback(null, configuredPorts)
  }
  // Sandbox env var is the happy path for Lambda runs
  else if (ARC_SANDBOX) {
    let { ports } = JSON.parse(ARC_SANDBOX)
    if (!ports) {
      return callback(notFound)
    }
    configuredPorts = ports
    callback(null, ports)
  }
  // Fall back to an internal SSM query in case Data is running as a bare module
  else {
    // We really only want to load aws-sdk if absolutely necessary, and only the client we need
    // eslint-disable-next-line
    let SSM = require('aws-sdk/clients/ssm')
    let local = env === 'testing'
    if (!local && !app) {
      return callback(ReferenceError('ARC_APP_NAME env var not found'))
    }
    if (local && !app) {
      app = 'arc-app'
    }
    let Name = `/${toLogicalID(`${app}-${env}`)}/ARC_SANDBOX/ports`
    let port = 2222
    let config = {
      endpoint: `http://localhost:${port}/_arc/ssm`,
      region: AWS_REGION || 'us-west-2',
    }
    let ssm = new SSM(config)
    ssm.getParameter({ Name }, function done (err, result) {
      if (err) callback(err)
      else {
        if (!result.Parameter.Value) {
          callback(ReferenceError('@begin/data requires Sandbox to be running'))
        }
        else {
          try {
            configuredPorts = JSON.parse(result.Parameter.Value)
            callback(null, configuredPorts)
          }
          catch (err) {
            callback(err)
          }
        }
      }
    })
  }
}
