module.exports = function toLogicalID (str) {
  str = str.replace(/([A-Z])/g, ' $1')
  if (str.length === 1) {
    return str.toUpperCase()
  }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase()
  str = str.charAt(0).toUpperCase() + str.slice(1)
  str = str.replace(/[\W_]+(\w|$)/g, (_, ch) => ch.toUpperCase())
  if (str === 'Get') {
    return 'GetIndex'
  }
  return str
}
