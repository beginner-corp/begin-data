/**
 * @private
 * @module getTableName
 *
 * Get the begin-data table name
 *
 * - the env var BEGIN_DATA_TABLE_NAME override always wins
 * - fallback to `data` table defined the current .arc
 * - final fallback to begin-data-production-data or begin-data-staging-data
 */
let parse = require('@architect/parser')
let join = require('path').join
let fs = require('fs')
let read = p=> fs.readFileSync(p).toString()
let exists = fs.existsSync
let table = false // cache between invocations

module.exports = function getTableName() {

  if (table)
    return table

  let raw
  let arc
  let env = process.env.NODE_ENV === 'testing'? 'staging' : process.env.NODE_ENV
  let cwd = process.cwd()
  let arcDefaultPath = join(cwd, '.arc')
  let appDotArcPath = join(cwd, 'app.arc')
  let arcYamlPath = join(cwd, 'arc.yaml')
  let arcJsonPath = join(cwd, 'arc.json')
  let localPath = join(__dirname, '..', '..', '..', '@architect', 'shared', '.arc')

  let override = process.env.hasOwnProperty('BEGIN_DATA_TABLE_NAME')
  if (override) {
    table = process.env.BEGIN_DATA_TABLE_NAME
  }
  else if (exists(arcDefaultPath)) {
    raw = read(arcDefaultPath)
    arc = parse(raw)
    table = `${arc.app[0]}-${env}-data`
  }
  else if (exists(appDotArcPath)) {
    raw = read(appDotArcPath)
    arc = parse(raw)
    table = `${arc.app[0]}-${env}-data`
  }
  else if (exists(arcYamlPath)) {
    raw = read(arcYamlPath)
    arc = parse.yaml(raw)
    // HACK
    raw = parse.yaml.stringify(raw)
    table = `${arc.app[0]}-${env}-data`
  }
  else if (exists(arcJsonPath)) {
    raw = read(arcJsonPath)
    arc = parse.json(raw)
    // HACK
    raw = parse.json.stringify(raw)
    table = `${arc.app[0]}-${env}-data`
  }
  else if (exists(localPath)) {
    // otherwise we are: testing, staging or in production
    // loading from node_modules/@architect/shared/.arc
    raw = read(localPath)
    arc = parse(raw)
    table = `${arc.app[0]}-${env}-data`
  }
  else {
    table = `begin-data-${env}-data`
  }

  return table
}
