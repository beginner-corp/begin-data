let aws = require('aws-sdk')
let http = require('http')
let tablename = false

module.exports = function getTableName (callback) {
  let override = process.env.BEGIN_DATA_TABLE_NAME
  // ARC_CLOUDFORMATION is present in live AWS deploys with Architect 6+
  let arc6 = process.env.ARC_CLOUDFORMATION || process.env.ARC_HTTP === 'aws_proxy'

  if (override) {
    callback(null, process.env.BEGIN_DATA_TABLE_NAME)
  }
  // Use cached value
  else if (tablename) {
    callback(null, tablename)
  }
  else if (arc6) {
    let isLocal = process.env.NODE_ENV === 'testing'
    let config
    if (isLocal) {
      // If running in Sandbox, use its SSM service discovery mock
      let port = process.env.ARC_INTERNAL || 3332
      config = {
        endpoint: new aws.Endpoint(`http://localhost:${port}/_arc/ssm`),
        region: process.env.AWS_REGION || 'us-west-2',
        httpOptions: { agent: new http.Agent() }
      }
    }
    let ssm = new aws.SSM(config)
    let Path = `/${process.env.ARC_CLOUDFORMATION || 'sandbox'}`
    ssm.getParametersByPath({ Path, Recursive: true }, function done (err, result) {
      if (err) callback(err)
      else {
        let table = param => param.Name.split('/')[2] === 'tables'
        let tables = result.Parameters.filter(table).reduce((a, b) => {
          a[b.Name.split('/')[3]] = b.Value
          return a
        }, {})
        if (!tables.data) {
          callback(ReferenceError('begin/data requires a table named data'))
        }
        else {
          tablename = tables.data
          callback(null, tablename)
        }
      }
    })
  }
  else {
    throw ReferenceError('begin/data could not find the data table')
  }
}
