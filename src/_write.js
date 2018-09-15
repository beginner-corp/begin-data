var tiny = require('tiny-json-http')
var getURL = require('./_get-url')

module.exports = function write(segment, params, callback) {
  if (!params.ns && !Array.isArray(params))
    throw ReferenceError('missing param ns')
  let token = process.env.APP_TOKEN
  let url = `${getURL(params)}/${segment}`
  tiny.post({
    url,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: params,
  },
  function res(err, result) {
    if (err) callback(err)
    else callback(null, result.body)
  })
}
