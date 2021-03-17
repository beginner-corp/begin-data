let read = require('@architect/inventory/src/read')
let tiny = require('tiny-json-http')
/**
 * Arc 6+ paths where project manifest needs to be read from root
 */
module.exports = async function getTableName () {
  let err = ReferenceError('@tables not defined! begin/data expects a data table')

  if (process.env.ARC_ENV === 'testing' ||
      process.env.NODE_ENV === 'testing') {
    try {
      let result = await tiny.get({ url: '/_asd' })
      let services = result.body
      if (services.tables.data) {
        return services.tables.data
      }
      else {
        throw err
      }
    }
    catch (e) {
      console.error(e)
      throw e
    }
  }
  else {
    let cwd = process.cwd()
    let type = 'projectManifest'

    try {
      // attempt to read the arcfile
      let { arc } = read({ type, cwd })

      // look for a table named 'data'
      if (arc.tables && arc.tables.some(t => Object.keys(t)[0] === 'data')) {
        // return the local table
        return `${arc.app[0]}-staging-data`
      }
      else {
        throw err
      }
    }
    catch (e) {
      console.error(e)
      throw err
    }
  }
}
