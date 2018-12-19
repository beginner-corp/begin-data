module.exports = function() {
  let env = process.env.NODE_ENV === 'testing'? 'staging' : process.env.NODE_ENV
  return process.env.BEGIN_DATA_TABLE_NAME || `begin-data-${env}-data`
}
