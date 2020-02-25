const oracledb = require('oracledb')
const db = require('../services/oracle.js')

const _sql = `SELECT ID "id",CODE "code",NAME "name",ORDERS "orders",DESCS "descs",
CREATED_BY "created_by",CREATED_AT "created_at",UPDATED_BY "updated_by",UPDATED_AT "updated_at",DELETED_BY "deleted_by",DELETED_AT "deleted_at",
FLAG "flag",COLOR "color",LEVELS "levels"
FROM ${process.env.DB_SCHEMA_TTKD}.ROLES`
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
  const sql = `INSERT INTO ${process.env.DB_SCHEMA_TTKD}.ROLES(NAME,ORDERS,DESCS,CREATED_BY,CREATED_AT,FLAG,COLOR,CODE,LEVELS,ROLES)
    VALUES(:name,:orders,:descs,:created_by,SYSDATE,:flag,:color,:code,:levels,:roles)
    returning id into :id`
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
  const sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.ROLES SET
    name=:name,
    orders=:orders,
    descs=:descs,
    updated_by=:updated_by,
    updated_at=SYSDATE,
    flag=:flag,
    color=:color,
    code=:code,
    levels=:levels,
    roles=:roles
    WHERE id=:id`
  const rs = await db.execute(sql, context)
  if (rs.rowsAffected > 0) {
    context.updated_at = new Date()
  } else context = null
  return context
}

module.exports.lock = async function(context) {
  const sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.ROLES SET FLAG=DECODE(flag,1,0,1) WHERE id=:id`
  const rs = await db.execute(sql, context)
  if (rs.rowsAffected > 0) {
    context.deleted_at = new Date()
  } else context = null
  return context
}

module.exports.delete = async function(context) {
  const sql = `DELETE ${process.env.DB_SCHEMA_TTKD}.ROLES WHERE id=:id`
  const rs = await db.execute(sql, context)
  return rs.rowsAffected
}

module.exports.selectRoleRoute = async function(context) {
  const sql = `SELECT ROLE_ID "role_id",ROUTE "route" FROM ${process.env.DB_SCHEMA_TTKD}.ROLE_ROUTE WHERE ROLE_ID=:role_id`
  const rs = await db.execute(sql, context)
  return rs.rows
}

module.exports.deleteRoleRoute = async function(context) {
  let sql = `DELETE ${process.env.DB_SCHEMA_TTKD}.ROLE_ROUTE WHERE ROLE_ID=:role_id`
  let rs = await db.execute(sql, context)
  return rs.rows
}

module.exports.insertRoleRoute = async function(context) {
  let sql = `DELETE ${process.env.DB_SCHEMA_TTKD}.ROLE_ROUTE WHERE ROLE_ID=:role_id`
  let rs = await db.execute(sql, { role_id: context.role_id })
  if (context.length) {
    sql = `INSERT INTO ${process.env.DB_SCHEMA_TTKD}.ROLE_ROUTE(ROLE_ID,ROUTE) 
  SELECT :role_id,:route FROM DUAL
  WHERE NOT EXISTS(SELECT * FROM ${process.env.DB_SCHEMA_TTKD}.ROLE_ROUTE where ROLE_ID=:role_id and ROUTE=:route)`
    rs = await db.executeMany(sql, context)
  }
  return rs.rows
}
