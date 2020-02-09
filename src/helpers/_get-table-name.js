let getTableNameForSandbox = require('./_get-table-name-sandbox')
let getTableNameForArc6 = require('./_get-table-name-ssm')
let olds = require('./_get-table-name-old')

module.exports = function _getTableName(callback) {

  let override = process.env.BEGIN_DATA_TABLE_NAME
  let sandbox = process.env.NODE_ENV === 'testing'
  // ARC_CLOUDFORMATION is present in live AWS deploys with Architect 6+
  // DEPRECATED + ARC_HTTP are present in 2019+ versions of Sandbox
  let arc6 = process.env.ARC_CLOUDFORMATION || process.env.ARC_HTTP === 'aws_proxy'
  let arc5 = !process.env.ARC_CLOUDFORMATION || process.env.DEPRECATED

  if (override) {
    callback(null, process.env.BEGIN_DATA_TABLE_NAME)
  }
  else if (sandbox) {
    // read .arc, app.arc, arc.json or arc.yaml
    callback(null, getTableNameForSandbox())
  }
  else if (arc6) {
    // read SSM param for data table
    getTableNameForArc6(callback)
  }
  else if (arc5) {
    // take teh old town road
    callback(null, olds())
  }
  else {
    throw ReferenceError('begin/data could not find the data table')
  }
}
