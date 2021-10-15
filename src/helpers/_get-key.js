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
  let env = process.env.ARC_ENV ? process.env.ARC_ENV : process.env.NODE_ENV
  let envKey = env === 'testing' ? 'staging' : (env || 'staging')
  let scopeID = process.env.BEGIN_DATA_SCOPE_ID || process.env.ARC_APP_NAME || 'sandbox'
  let dataID = `${envKey}#${table}#${key}`
  return { scopeID, dataID }
}
