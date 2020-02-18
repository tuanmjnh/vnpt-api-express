const Model = function(name, schema, options = {}) {
  const keys = Object.keys(schema)
  if (!options.lower) options.lower = true
  this.name = name
  this.schema = schema
  this.options = options
  // select
  this.select = function() {
    let rs = 'SELECT '
    keys.forEach(e => { rs += `${e.toUpperCase()} "${options.lower ? e.toLowerCase() : e}",` })
    rs = `${rs.substr(0, rs.length - 1)} FROM ${name.toUpperCase()}`
    return rs
  }
  this.insert = function(context) {
    let rs = `INSERT INTO ${name.toUpperCase()}(`
    let value = ''
    let _keys = keys
    if (context) _keys = Object.keys(context)
    for (const e of _keys) {
      if (schema[e].auto) continue
      rs += `${e.toUpperCase()},`
      value += options.lower ? `:${e.toLowerCase()},` : `:${e},`
    }
    rs = `${rs.substr(0, rs.length - 1)}) VALUES(${value.substr(0, value.length - 1)})`
    return rs
  }
  this.update = function(context, condition) {
    let rs = `UPDATE ${name.toUpperCase()} SET `
    let where = ' WHERE '
    let _keys = keys
    if (context) _keys = Object.keys(context)
    for (const e of _keys) {
      if (schema[e].key) where += `${e.toUpperCase()}=:${options.lower ? e.toLowerCase() : e}`
      else rs += `${e.toUpperCase()}=:${options.lower ? e.toLowerCase() : e},`
    }
    rs = rs.substr(0, rs.length - 1) + where
    if (condition) {
      rs += ' AND '
      Object.keys(condition).forEach(e => { rs += `${e.toUpperCase()}=:${options.lower ? e.toLowerCase() : e} AND ` })
      rs = rs.substr(0, rs.length - 5)
    }
    return rs
  }
  this.delete = function(context) {
    let rs = `DELETE ${name.toUpperCase()} WHERE `
    Object.keys(context).forEach(e => { rs += `${e.toUpperCase()}=:${options.lower ? e.toLowerCase() : e} AND ` })
    rs = rs.substr(0, rs.length - 5)
    return rs
  }
  this.deleteAll = function() {
    let rs = `DELETE ${name.toUpperCase()}`
    return rs
  }
  return this
}

module.exports = Model
