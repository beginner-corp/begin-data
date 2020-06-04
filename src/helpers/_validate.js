/**
 * @private
 * @module validate
 *
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
 * ensures the following:
 *
 * - between 1 and 50 characters
 * - characters can be any alphanumeric and url safe punctuation
 *   - alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
 *   - numeric: '0123456789',
 *   - puncuation: .,:-/+?&=@
 *  -
 *
 * validate.size([item|items])
 * ---
 * ensures the following
 * - has a table and key
 * - is less than 50KB
 *
 */

let max = 50
let min = 1
let ok = str => /[a-z A-Z0-9.,:\-/+?&=@]+/g.test(str)

module.exports = {

  table (t) {
    if (Array.isArray(t)) {
      let missingTable = t.some(i => !i['table'])
      if (missingTable)
        throw ReferenceError('Table is not defined')

      let tooBig = t.some(i => i.table.length > max)
      if (tooBig) {
        let name = t.find(i => i.table.length > max).table
        let len = name.length
        throw Error(`Table name has too many characters; max ${max}, received ${len} for ${name}`)
      }

      let tooShort = t.some(i => i.table.length < min)
      if (tooShort)
        throw Error(`Table name is too small`)

      let invalidChars = t.some(i => !ok(i.table))
      if (invalidChars) {
        let name = t.find(i => !ok(i.table)).table
        throw SyntaxError(`Invalid table name of ${name}: names must be alphanumeric and can use the only the following URL safe puncation: .,:-/+?&=@`)
      }
    }
    else {
      if (!t)
        throw ReferenceError('Table is not defined')

      if (t.length > max)
        throw Error(`Table name has too many characters; max ${max}, received ${t.length} for ${t}`)

      if (t.length < min)
        throw Error(`Table name is too small`)

      if (!ok(t))
        throw SyntaxError(`Invalid table name of ${t}: names must be alphanumeric and can use the only the following URL safe puncation: .,:-/+?&=@`)
    }
  },

  key (k) {
    if (!k)
      throw ReferenceError('Key is not defined')

    if (k.length > max)
      throw Error(`Key name has too many characters; max ${max}, received ${k.length}`)

    if (k.length < min)
      throw Error(`Key name is too small`)

    if (!ok(k))
      throw SyntaxError(`Invalid key name of ${k}: names must be alphanumeric and can use the only the following URL safe puncation: .,:-/+?&=@`)
  },

  size (i) {
    let _size = i => Buffer.byteLength(JSON.stringify(i)) > 200000
    let tooBig = Array.isArray(i) ? i.some(_size) : _size(i)
    if (tooBig)
      throw Error(`Item too large; must be less than 200KB`)
  }
}
