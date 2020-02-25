const db = require('../services/oracle.js')

module.exports.select = async function(context, order) {
  let sql = `SELECT id "id",loai_nv "loai_nv" FROM ${process.env.DB_SCHEMA_TTKD}.LOAI_NV`
  const keys = Object.keys(context)
  if (keys.length) {
    sql += ' WHERE '
    keys.forEach(e => { sql += `${e}=:${e} AND ` })
    sql = sql.substr(0, sql.length - 5)
  }
  if (order && order.length) sql += ` ORDER BY ${order}`
  const rs = await db.execute(sql, context)
  return rs.rows
}
