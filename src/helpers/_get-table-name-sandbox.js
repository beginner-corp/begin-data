const path = require('path')
const read = require('@architect/inventory/src/read')

/**
 * Arc 6+ paths where project manifest needs to be read from root
 */
module.exports = function getTableName () {
  let err = ReferenceError('@tables not defined! begin/data expects a data table')

  try {
    let processRoot = getStagingDataTable({ cwd: process.cwd() })
    let defaultLevel = getStagingDataTable({ cwd: path.resolve(path.join('..', '..', '..')) })
    let firstLevel = getStagingDataTable({ cwd: path.resolve(path.join('..')) })
    let secondLevel = getStagingDataTable({ cwd: path.resolve(path.join('..', '..')) })

    if (processRoot) {
      return processRoot
    }
    else if (defaultLevel) {
      return defaultLevel
    }
    else if (firstLevel) {
      return firstLevel
    }
    else if (secondLevel) {
      return secondLevel
    }
    else throw err
  }
  catch (e) {
    console.error(e)
    throw err
  }

  function getStagingDataTable ({ cwd }) {
    // attempt to read the arcfile
    let { arc } = read({ type: 'projectManifest', cwd })
    if (arc.tables) {
      if (arc.tables.some(t => Object.keys(t)[0] === 'data')) {
        return `${arc.app[0]}-staging-data`
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }
}
