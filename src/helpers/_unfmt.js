/**
 * @private
 * @module unfmt
 */
module.exports = function unfmt (obj) {
  if (!obj)
    return null
  let copy = { ...obj }
  copy.key = obj.dataID.split('#')[2]
  copy.table = obj.dataID.split('#')[1]
  delete copy.scopeID
  delete copy.dataID
  return copy
}
