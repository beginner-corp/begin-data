let tiny = require('tiny-json-http')

module.exports = function getTableName (callback) {

  let port = process.env.PORT || 3333
  let url = `http://localhost:${port}/_asd`

  tiny.get({ url }, function done (err, result) {
    if (err) callback(err)
    else {
      let services = result.body
      if (services.tables.data) {
        callback(null, services.tables.data)
      }
      else {
        let err = ReferenceError('@tables not defined! begin/data expects a data table')
        callback(err)
      }
    }
  })
}
