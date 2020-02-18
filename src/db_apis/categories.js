const db = require('../services/oracle.js')

const _sql = `SELECT ID "id",
APP_KEY "app_key",
CODE "code",
DEPENDENT "dependent",
LEVELS "levels",
TITLE "title",
ICON "icon",
IMAGE "name",
URL "url",
ORDERS "orders",
QUANTITY "quantity",
POSITION "position",
DESCS "descs",
CONTENT "content",
ATTACH "attach",
TAGS "tags",
START_AT "start_at",
END_AT "end_at",
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
FROM TTKD_BKN.GROUPS`
module.exports.paging = async function(context, condition) {
  context.v_sql = `${_sql} WHERE ${condition}`
  const rs = await db.executeCursors('ttkd_bkn.PAGING', context)
  return { data: rs.cursor, rowsNumber: rs.out.v_total }
}

module.exports.getAll = async function(condition) {
  const sql = `${_sql} WHERE ${condition}`
  const rs = await db.execute(sql)
  return rs.rows
}
module.exports.getKey = async function() {
  const sql = `SELECT DISTINCT APP_KEY "key" FROM TTKD_BKN.GROUPS`
  const rs = await db.execute(sql)
  return rs.rows
}

module.exports.insert = async function(context) {
  const sql = `INSERT INTO TTKD_BKN.GROUPS(APP_KEY,CODE,DEPENDENT,LEVELS,TITLE,ICON,IMAGE,URL,ORDERS,QUANTITY,POSITION,
       DESCS,CONTENT,TAGS,ATTACH,START_AT,END_AT,CREATED_IP,CREATED_BY,CREATED_AT,FLAG)
       VALUES(:app_key,:code,:dependent,:levels,:title,:icon,:image,:url,:orders,:quantity,:position,
      :descs,:content,:tags,:attach,:start_at,:end_at,:created_ip,:created_by,SYSDATE,:flag)
    returning id into :id`
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
  // APP_KEY=:app_key,CODE=:code,DEPENDENT=:dependent,
  const sql = `UPDATE TTKD_BKN.GROUPS SET
  LEVELS=:levels,TITLE=:title,ICON=:icon,IMAGE=:image,URL=:url,ORDERS=:orders,QUANTITY=:quantity,
  POSITION=:position,DESCS=:descs,CONTENT=:content,TAGS=:tags,ATTACH=:attach,START_AT=:start_at,
  END_AT=:end_at,UPDATED_IP=:updated_ip,UPDATED_BY=:updated_by,UPDATED_AT=SYSDATE,FLAG=:flag
  WHERE ID=:id`
  const rs = await db.execute(sql, context)
  if (rs.rowsAffected > 0) {
    context.updated_at = new Date()
  } else context = null
  return context
}

module.exports.lock = async function(context) {
  const sql = `UPDATE TTKD_BKN.GROUPS 
  SET FLAG=DECODE(flag,1,0,1),DELETED_IP=:deleted_ip,DELETED_BY=:deleted_by,DELETED_AT=SYSDATE
  WHERE id=:id`
  const rs = await db.executeMany(sql, context)
  if (rs.rowsAffected > 0) {
    context.deleted_at = new Date()
  } else context = null
  return context
}

module.exports.delete = async function(context) {
  const sql = `DELETE TTKD_BKN.GROUPS WHERE id=:id`
  const rs = await db.execute(sql, context)
  return rs.rowsAffected
}
