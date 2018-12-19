module.exports = function _getKey(params) {
  let {table, key} = params
  let env = process.env.NODE_ENV === 'testing'? 'staging' : (process.env.NODE_ENV || 'staging')
  let scopeID = process.env.BEGIN_DATA_SCOPE_ID || 'local'
  let dataID = `${env}#${table}#${key}`
  return {scopeID, dataID}
}
