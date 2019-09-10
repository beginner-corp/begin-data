let getTableNameForSandbox = require('./_get-table-name-sandbox')
let getTableName = require('./_get-table-name-ssm')
let olds = require('./_get-table-name-old')

module.exports = function _getTableName(callback) {

  let override = process.env.hasOwnProperty('BEGIN_DATA_TABLE_NAME')
  let sandbox = process.env.NODE_ENV === 'testing' || process.env.ARC_LOCAL
  let arc5 = !!process.env.DEPRECATED
  let arc6 = !!process.env.ARC_CLOUDFORMATION

  if (override) {
    callback(null, process.env.BEGIN_DATA_TABLE_NAME)
  }
  else if (sandbox) {
    // read .arc, app.arc, arc.json or arc.yaml
    callback(null, getTableNameForSandbox())
  }
  else if (arc5) {
    // take teh old town road
    callback(null, olds())
  }
  else if (arc6) {
    // read SSM param for data table
    getTableName(callback)
  }
  else {
    throw ReferenceError('begin/data could not find the data table')
  }
}
