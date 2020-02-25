const db = require('../services/oracle.js')

const _sql = `SELECT ID "id",
APP_KEY "app_key",
GROUP_ID "group_id",
TITLE "title",
ICON "icon",
IMAGE "image",
URL "url",
ORDERS "orders",
QUANTITY "quantity",
DESCS "descs",
CONTENT "content",
ATTACH "attach",
TAGS "tags",
CREATED_IP "created_ip",
CREATED_BY "created_by",
CREATED_AT "created_at",
UPDATED_IP "updated_ip",
UPDATED_BY "updated_by",
UPDATED_AT "updated_at",
DELETED_IP "deleted_ip",
DELETED_BY "deleted_by",
DELETED_AT "deleted_at",
FLAG "flag"
FROM ${process.env.DB_SCHEMA_TTKD}.ITEMS`
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
module.exports.getKey = async function() {
  const sql = `SELECT DISTINCT APP_KEY "key" FROM ${process.env.DB_SCHEMA_TTKD}.ITEMS`
  const rs = await db.execute(sql)
  return rs.rows
}

module.exports.insert = async function(context) {
  const sql = `INSERT INTO ${process.env.DB_SCHEMA_TTKD}.ITEMS(APP_KEY,GROUP_ID,TITLE,ICON,IMAGE,URL,ORDERS,QUANTITY,
       DESCS,CONTENT,ATTACH,TAGS,CREATED_IP,CREATED_BY,CREATED_AT,FLAG)
       VALUES(:app_key,:group_id,:title,:icon,:image,:url,:orders,:quantity,
      :descs,:content,:attach,:tags,:created_ip,:created_by,SYSDATE,:flag)
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
  const sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.ITEMS SET APP_KEY=:app_key,GROUP_ID=:group_id,TITLE=:title,ICON=:icon,
  IMAGE=:image,URL=:url,ORDERS=:orders,QUANTITY=:quantity,DESCS=:descs,CONTENT=:content,ATTACH=:attach,
  TAGS=:tags,UPDATED_IP=:updated_ip,UPDATED_BY=:updated_by,UPDATED_AT=SYSDATE,FLAG=:flag
  WHERE ID=:id`
  const rs = await db.execute(sql, context)
  if (rs.rowsAffected > 0) {
    context.updated_at = new Date()
  } else context = null
  return context
}

module.exports.lock = async function(context) {
  const sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.ITEMS 
  SET FLAG=DECODE(flag,1,0,1),DELETED_IP=:deleted_ip,DELETED_BY=:deleted_by,DELETED_AT=SYSDATE
  WHERE id=:id`
  const rs = await db.executeMany(sql, context)
  if (rs.rowsAffected > 0) {
    context.deleted_at = new Date()
  } else context = null
  return context
}

module.exports.delete = async function(context) {
  const sql = `DELETE ${process.env.DB_SCHEMA_TTKD}.ITEMS WHERE id=:id`
  const rs = await db.execute(sql, context)
  return rs.rowsAffected
}
