const db = require('../services/oracle.js')

const _sql = `select nd.nguoidung_id "nguoidung_id",
nd.ma_nd "ma_nd",
nd.ten_nd "ten_nd",
nd.quantri "quantri",
nd.nhanvien_id "nhanvien_id",
nd.nhom_nd_id "nhom_nd_id",
nd.trangthai "trangthai",
nd.ngoaile "ngoaile",
nv.ma_nv "ma_nv",
nv.ten_nv "ten_nv",
nv.diachi_nv "diachi_nv",
nv.so_dt "so_dt",
nv.gioitinh "gioitinh",
nv.chucdanh "chucdanh",
nv.ngay_sn "ngay_sn",
nv.ten_tn "ten_tn",
dv.ten_dv "ten_dv",
r.name "roles",
r.ID "roles_id",
r.color "roles_color"
from ${process.env.DB_SCHEMA_ADMIN}.nguoidung nd,
${process.env.DB_SCHEMA_ADMIN}.nhanvien nv,
${process.env.DB_SCHEMA_TTKD}.nguoidung tnd,
${process.env.DB_SCHEMA_TTKD}.roles r,
${process.env.DB_SCHEMA_ADMIN}.donvi dv,
${process.env.DB_SCHEMA_ADMIN}.donvi_ldv ldv
where nd.nguoidung_id=tnd.nguoidung_id(+)
and nd.nhanvien_id=nv.nhanvien_id
and tnd.roles_id=r.id(+)
and nv.donvi_id=dv.donvi_id and dv.donvi_id=ldv.donvi_id(+) and (ldv.loaidv_id in(1,7,23) or ldv.loaidv_id is null)
and nd.nguoidung_id not in(6502,0,2,4,6503,6555,6556,6475,6443,6449,6445,6446,6444,6447,6448,6500,3,6557,940,6509)`

module.exports.paging = async function(context, condition) {
  context.v_sql = `${_sql} and ${condition}`
  const rs = await db.executeCursors(`${process.env.DB_SCHEMA_TTKD}.PAGING`, context)
  return { data: rs.cursor, rowsNumber: rs.out.v_total }
}

module.exports.getAll = async function(condition) {
  const sql = `${_sql} and ${condition}`
  const rs = await db.execute(sql)
  return rs.rows
}

module.exports.find = async function(context, order) {
  const _sql = `select nd.nguoidung_id "nguoidung_id",
    nd.ma_nd "ma_nd",
    nd.ten_nd "ten_nd",
    nd.quantri "quantri",
    nd.nhanvien_id "nhanvien_id",
    nd.nhom_nd_id "nhom_nd_id",
    nd.trangthai "trangthai",
    nd.ngoaile "ngoaile",
    nv.ma_nv "ma_nv",
    nv.ten_nv "ten_nv",
    nv.diachi_nv "diachi_nv",
    nv.so_dt "so_dt",
    nv.gioitinh "gioitinh",
    nv.chucdanh "chucdanh",
    nv.ngay_sn "ngay_sn",
    nv.ten_tn "ten_tn",
    dv.ten_dv "ten_dv",
    dv.donvi_id "donvi_id",
    r.name "roles",
    r.ID "roles_id",
    r.color "roles_color"
    from ${process.env.DB_SCHEMA_ADMIN}.nguoidung nd,
    ${process.env.DB_SCHEMA_ADMIN}.nhanvien nv,
    ${process.env.DB_SCHEMA_TTKD}.nguoidung tnd,
    ${process.env.DB_SCHEMA_TTKD}.roles r,
    ${process.env.DB_SCHEMA_ADMIN}.donvi dv,
    ${process.env.DB_SCHEMA_ADMIN}.donvi_ldv ldv
    where nd.nguoidung_id=tnd.nguoidung_id(+)
    and nd.nhanvien_id=nv.nhanvien_id
    and tnd.roles_id=r.id(+)
    and nv.donvi_id=dv.donvi_id and dv.donvi_id=ldv.donvi_id(+) and (ldv.loaidv_id in(1,7,23) or ldv.loaidv_id is null)
    and nd.nguoidung_id not in(6502,0,2,4,6503,6555,6556,6475,6443,6449,6445,6446,6444,6447,6448,6500,3,6557,940,6509)`
  let sql = ''
  const keys = Object.keys(context)
  if (keys.length) {
    sql += ' WHERE '
    keys.forEach(e => { sql += `"${e}"=:${e} AND ` })
    sql = sql.substr(0, sql.length - 5)
  }
  if (order && order.length) sql += ` ORDER BY ${order}`
  sql = `select * from (${_sql}) ${sql}`
  const rs = await db.execute(sql, context)
  return rs.rows
}

module.exports.getPassword = async function(context) {
  const sql = `SELECT ${process.env.DB_SCHEMA_CSS}.GIAIMA_MK(MATKHAU)"matkhau" FROM ${process.env.DB_SCHEMA_ADMIN}.NGUOIDUNG WHERE MA_ND=:ma_nd`
  const rs = await db.execute(sql, context)
  if (rs.rows.length) return rs.rows[0]
  return { matkhau: '' }
}

module.exports.setRoles = async function(ct_insert, ct_update) {
  let sql = `INSERT INTO TTKD_BKN.NGUOIDUNG(NGUOIDUNG_ID, MATKHAU,SALT,ROLES_ID)
  SELECT :nguoidung_id,:matkhau,:salt,:roles_id FROM DUAL
  WHERE NOT EXISTS(SELECT * FROM TTKD_BKN.NGUOIDUNG WHERE NGUOIDUNG_ID=:nguoidung_id)`
  let rs = await db.executeMany(sql, ct_insert)
  if (!rs.rowsAffected) {
    sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.NGUOIDUNG SET ROLES_ID=:roles_id WHERE nguoidung_id=:nguoidung_id`
    rs = await db.executeMany(sql, ct_update)
  }
  return rs
}
