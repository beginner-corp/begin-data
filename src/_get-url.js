module.exports = function getURL(params) {
  var url = 'https://begin.com/data'
  if (process.env.NODE_ENV === 'testing')
    url = 'http://localhost:3333/data'
  if (process.env.APP_IS_STAGING)
    url = 'https://staging.begin.com/data'
  if (params.ns)
    url += '/' + params.ns
  if (params.key)
    url += '/' + params.key
  return url
}
