let { join } = require('path')
let { readArc } = require('@architect/parser')

/**
 * Arc 6+ paths where project manifest needs to be read from root
 */
module.exports = function getTableName() {
  // Try cwd first (usually testing)
  let result = readArc()
  // Try project root next (usually from within a Sandbox Lambda)
  if (!result.filepath) result = readArc({ cwd: join(process.cwd(), '..', '..', '..') })
  // If we still didn't find it, blow up
  if (!result.filepath) throw ReferenceError('Architect project manifest not found')

  let { arc } = result
  if (arc.tables && arc.tables.some(t=> Object.keys(t)[0] === 'data'))
    return `${arc.app[0]}-staging-data`
  throw ReferenceError('@tables not defined! begin/data expects a data table')
}
