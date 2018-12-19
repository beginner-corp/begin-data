/**
 * validate.table([table|items])
 * ---
 * ensures the following:
 *
 * - between 1 and 50 characters
 * - characters can be any alphanumeric and url safe punctuation
 *   - alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
 *   - numeric: '0123456789',
 *   - puncuation: .,:-/+?&=@
 *
 *
 * validate.key([key|items])
 * ---
 *
 * ensures the following:
 *
 * - between 1 and 50 characters
 * - characters can be any alphanumeric and url safe punctuation
 *   - alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
 *   - numeric: '0123456789',
 *   - puncuation: .,:-/+?&=@
 *  -
 *
 *
 * validate.size([item|items])
 * ---
 * ensures the following
 * - has a table and key
 * - is less than 10kb
 *
 */

let max = 50
let min = 1
let ok = str=> /[a-z A-Z0-9.,:\-/+?&=@]+/g.test(str)

module.exports = {

  table(t) {

    if (Array.isArray(t)) {

      let missingTable = t.some(i=> !i.hasOwnProperty('table'))
      if (missingTable)
        throw ReferenceError('table is not defined')

      let tooBig = t.some(i=> i.table.length > max)
      if (tooBig) {
        let name = t.find(i=> i.table.length > max).table
        let len = name.length
        throw Error(`table name too big; max ${max} received ${len} for ${name}`)
      }

      let tooShort = t.some(i=> i.table.length < min)
      if (tooShort)
        throw Error(`table name too small!`)

      let invalidChars = t.some(i=> !ok(i.table))
      if (invalidChars) {
        let name = t.find(i=> !ok(i.table)).table
        throw SyntaxError(`invalid table name ${name}: names must be alphanumeric and can use the only the  following url safe puncation .,:-/+?&=@`)
      }
    }
    else {
      if (!t)
        throw ReferenceError('table is not defined')

      if (t.length > max)
        throw Error(`table name too big; max ${max} received ${t.length} for ${t}`)

      if (t.length < min)
        throw Error(`table name too small!`)

      if (!ok(t))
        throw SyntaxError(`invalid table name ${t}: names must be alphanumeric and can use the only the  following url safe puncation .,:-/+?&=@`)
    }
  },

  key(k) {
    if (!k)
      throw ReferenceError('key is not defined')

    if (k.length > max)
      throw Error(`key name too big; max ${max} received ${k.length}`)

    if (k.length < min)
      throw Error(`key name too small!`)

    if (!ok(k))
      throw SyntaxError('invalid key name: names must be alphanumeric and can use the only the  following url safe puncation .,:-/+?&=@')
  },

  size(i) {
    let _size = i=> Buffer.byteLength(JSON.stringify(i)) > 10000
    let tooBig = Array.isArray(i)? i.some(_size) : _size(i)
    if (tooBig)
      throw Error(`item too large; must be less than 10kb`)
  }
}


