const db = require('../services/oracle.js')

const _sql = `SELECT key "key",code "code",title "title",orders "orders",flag "flag" FROM ${process.env.DB_SCHEMA_TTKD}.APP_KEY`
module.exports.paging = async function(context, condition) {
  context.v_sql = `${_sql} WHERE ${condition}`
  const rs = await db.executeCursors(`${process.env.DB_SCHEMA_TTKD}.PAGING`, context)
  return { data: rs.cursor, rowsNumber: rs.out.v_total }
}

module.exports.getAll = async function(condition) {
  const sql = `${_sql} WHERE ${condition}`
  const rs = await db.execute(sql)
  return rs.rows
}

module.exports.insert = async function(context) {
  const sql = `INSERT INTO ${process.env.DB_SCHEMA_TTKD}.APP_KEY(KEY,CODE,TITLE,ORDERS,FLAG)
    VALUES(:key,:code,:title,:orders,:flag)
    returning key into :key`
  // context.id = { type: oracledb.STRING, dir: oracledb.BIND_OUT }
  context.id = { type: 2001, dir: 3003 }// BIND_OUT
  const rs = await db.execute(sql, context)
  if (rs.rowsAffected > 0) {
    context.created_at = new Date()
    context.id = rs.outBinds.id[0]
  } else {
    context = null
  }
  return context
}

module.exports.update = async function(context) {
  const sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.APP_KEY SET TITLE=:title,ORDERS=:orders,FLAG=:flag
    WHERE key=:key AND code=:code`
  const rs = await db.execute(sql, context)
  if (rs.rowsAffected > 0) {
    context.updated_at = new Date()
  } else context = null
  return context
}

module.exports.lock = async function(context) {
  const sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.APP_KEY SET FLAG=DECODE(flag,1,0,1) WHERE CODE=:code AND KEY=:key`
  const rs = await db.executeMany(sql, context)
  if (rs.rowsAffected > 0) {
    context.deleted_at = new Date()
  } else context = null
  return context
}

module.exports.delete = async function(context) {
  const sql = `DELETE ${process.env.DB_SCHEMA_TTKD}.APP_KEY WHERE key=:key AND code=:code`
  const rs = await db.execute(sql, context)
  return rs.rowsAffected
}
