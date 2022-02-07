/**
 * @private
 * @module getKey
 *
 * Get the begin-data partition key (scopeID) and sort key (dataID)
 *
 * - the env var BEGIN_DATA_SCOPE_ID override always wins
 * - uses ARC_APP_NAME if it exists
 * - fallback to 'local' for running in the sandbox
 * - dataID is scoped to staging or production depending on NODE_ENV
 */
module.exports = function getKey (params) {
  let { table, key } = params
  let { ARC_APP_NAME, ARC_ENV, BEGIN_DATA_SCOPE_ID } = process.env
  let env = ARC_ENV
  let envKey = env === 'testing' ? 'staging' : (env || 'staging')
  let scopeID = BEGIN_DATA_SCOPE_ID || ARC_APP_NAME || 'sandbox'
  let dataID = `${envKey}#${table}#${key}`
  return { scopeID, dataID }
}
