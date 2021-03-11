let { join } = require('path')
let read = require('@architect/inventory/src/read')

/**
 * Arc 6+ paths where project manifest needs to be read from root
 */
module.exports = function getTableName () {
  let type = 'projectManifest'
  let err = ReferenceError('@tables not defined! begin/data expects a data table')

  try {
    let config = process.env.__ARC_CONFIG__
    let sandboxRoot = JSON.parse(config).projectSrc
    let lastDitch = join(process.cwd(), '..', '..', '..')
    if (getLocalDataTable(type, process.cwd())) {
      return getLocalDataTable(type, process.cwd())
    }
    else if (getLocalDataTable(type, sandboxRoot)) {
      return getLocalDataTable(type, sandboxRoot)
    }
    else if (getLocalDataTable(type, lastDitch)) {
      return getLocalDataTable(type, lastDitch)
    }
    else {
      throw err
    }
  }
  catch (e) {
    throw err
  }

  function getLocalDataTable (type, cwd) {
    // attempt to read the arcfile
    let { arc } = read({ type, cwd })
    console.log('============================')
    console.log('ARC:::: \n', arc)
    console.log('============================')
    return hasDataTable(arc)
      // return the local table
      ? `${arc.app[0]}-staging-data`
      : false
  }

  function hasDataTable (arc) {
    // look for a table named 'data'
    return arc.tables &&
      arc.tables.some(t => Object.keys(t)[0] === 'data')
  }

  /*
  // Try cwd first (usually testing)
  let result = readArc()
  // Try project root next (usually from within a Sandbox Lambda)
  if (!result.filepath) result = readArc({ cwd: join(process.cwd(), '..', '..', '..') })
  // If we still didn't find it, blow up
  if (!result.filepath) throw ReferenceError('Architect project manifest not found')

  let { arc } = result
  if (arc.tables && arc.tables.some(t => Object.keys(t)[0] === 'data'))
    return `${arc.app[0]}-staging-data`
  throw ReferenceError('@tables not defined! begin/data expects a data table')
  */
}
