let aws = require('aws-sdk')
let http = require('http')
let tablename = false

module.exports = function getTableName (callback) {
  let { ARC_APP_NAME, ARC_ENV, ARC_SANDBOX, AWS_REGION, BEGIN_DATA_TABLE_NAME } = process.env

  if (BEGIN_DATA_TABLE_NAME) {
    callback(null, BEGIN_DATA_TABLE_NAME)
  }
  // Use cached value
  else if (tablename) {
    callback(null, tablename)
  }
  else {
    let isLocal = ARC_ENV === 'testing'
    let config
    if (isLocal) {
      // If running in Sandbox, use its SSM service discovery mock
      let { ports } = JSON.parse(ARC_SANDBOX)
      let port = ports._arc
      config = {
        endpoint: new aws.Endpoint(`http://localhost:${port}/_arc/ssm`),
        region: AWS_REGION || 'us-west-2',
        httpOptions: { agent: new http.Agent() }
      }
    }
    let ssm = new aws.SSM(config)
    let appName = toLogicalID(`${ARC_APP_NAME}-${ARC_ENV}`)
    let Path = `/${appName}/tables`
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
}

function toLogicalID (str) {
  str = str.replace(/([A-Z])/g, ' $1')
  if (str.length === 1) {
    return str.toUpperCase()
  }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase()
  str = str.charAt(0).toUpperCase() + str.slice(1)
  str = str.replace(/[\W_]+(\w|$)/g, (_, ch) => ch.toUpperCase())
  if (str === 'Get') {
    return 'GetIndex'
  }
  return str
}
