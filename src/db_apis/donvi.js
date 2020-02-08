const oracledb = require('oracledb')
const db = require('../services/oracle.js')

const _sql = `SELECT donvi_id "donvi_id",ten_dv "ten_dv",ma_dv "ma_dv",diachi_dv "diachi_dv",so_dt "so_dt",
so_fax "so_fax",mst "mst",stk "stk",nguoi_dd "nguoi_dd",chucdanh "chucdanh",nganhang_id "nganhang_id",
ten_dvql "ten_dvql",donvi_ql "donvi_ql",muc_id "muc_id",donvi_cha_id "donvi_cha_id",donvi_id_neo "donvi_id_neo",
ghichu "ghichu",email "email",website "website",tinh_id "tinh_id",tiento "tiento",kinhdo "kinhdo",vido "vido",
mota "mota",toado_vpv "toado_vpv",nguoi_dai_dien "nguoi_dai_dien",icon "icon",hthd_id "hthd_id",
mabc_id_neo "mabc_id_neo",giay_uq "giay_uq",giayphep_kd "giayphep_kd",ngaycap "ngaycap",noicap "noicap" FROM (
SELECT * FROM ADMIN_BKN.DONVI WHERE DONVI_ID IN(0,5494)
UNION ALL
SELECT * FROM ADMIN_BKN.DONVI WHERE DONVI_CHA_ID IN(5494) AND DONVI_ID NOT IN(7931,762,205647,7627,20564,25296,25297,25298))`
module.exports.paging = async function(context) {
  context.v_sql = `${_sql} WHERE ${context.v_sql}`
  const rs = await db.executeCursors('ttkd_bkn.PAGING', context)
  return { data: rs.cursor, rowsNumber: rs.out.v_total }
}

module.exports.getAll = async function(context) {
  const sql = `${_sql} ${context.condition.length ? `WHERE ${context.condition}` : ''} ${context.order.length ? `ORDER BY ${context.order}` : ''}`
  const rs = await db.execute(sql)
  return rs.rows
}

module.exports.find = async function(context) {
  let sql = `${_sql} WHERE `
  Object.keys(context).forEach(e => {
    sql += `${e}=:${context[e]}`
  })
  const rs = await db.execute(sql, context)
  return rs.rows
}
module.exports.insert = async function(context) {
  const sql = `INSERT INTO TTKD_BKN.ROLES(ID,NAME,ORDERS,DESCS,CREATED_BY,CREATED_AT,FLAG,COLOR,CODE,LEVELS,ROLES
    VALUES(SYS_GUID(),:name,:orders,:descs,:created_by,SYSDATE,:flag,:color,:code,:levels,:roles)
    returning id into :id`
  context.id = { type: oracledb.STRING, dir: oracledb.BIND_OUT }
  console.log(context)
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
  const sql = `UPDATE TTKD_BKN.ROLES SET
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
  const sql = `UPDATE TTKD_BKN.ROLES SET flag=:flag WHERE id=:id`
  const rs = await db.execute(sql, context)
  if (rs.rowsAffected > 0) {
    context.deleted_at = new Date()
  } else context = null
  return context
}

module.exports.delete = async function(context) {
  const sql = `DELETE TTKD_BKN.ROLES WHERE id=:id`
  const rs = await db.execute(sql, context)
  return rs.rowsAffected
}
