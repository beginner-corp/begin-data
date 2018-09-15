var tiny = require('tiny-json-http')
var getURL = require('./_get-url')

module.exports = function read(params, callback) {
  let token = process.env.APP_TOKEN
  let url = getURL(params)
  tiny.get({
    url,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: Array.isArray(params)? {query:Buffer.from(JSON.stringify(params)).toString('base64')} : params,
  },
  function res(err, result) {
    if (err) callback(err)
    else callback(null, result.body)
  })
}
