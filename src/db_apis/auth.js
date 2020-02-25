const db = require('../services/oracle.js');

module.exports.getNguoidung = async function(context) {
  const sql = `select nd.nguoidung_id "nguoidung_id",
              nd.ma_nd "ma_nd",
              nd.matkhau "matkhau",
              ${process.env.DB_SCHEMA_CSS}.giaima_mk(nd.matkhau) "giaima_mk",
              nd.trangthai "trangthai",
              nv.ma_nv ma_nv,
              nv.donvi_id "donvi_id"
              from ${process.env.DB_SCHEMA_ADMIN}.nguoidung nd,
              ${process.env.DB_SCHEMA_ADMIN}.nhanvien nv,
              ${process.env.DB_SCHEMA_TTKD}.nguoidung tnd,
              ${process.env.DB_SCHEMA_TTKD}.roles r
              WHERE nd.nhanvien_id=nv.nhanvien_id
              and nd.nguoidung_id=tnd.nguoidung_id(+)
              and tnd.roles_id=r.id(+)
              and nd.ma_nd=:username`;
  const rs = await db.execute(sql, context);
  return rs.rows;
};

module.exports.updateAuth = async function(context) {
  const sql = `update ${process.env.DB_SCHEMA_TTKD}.nguoidung set
              last_login=SYSDATE
              where nguoidung_id=:nguoidung_id`;
  // token=:token
  const rs = await db.execute(sql, context);
  if (rs.rowsAffected && rs.rowsAffected === 1) {
    return true;
  } else {
    return null;
  }
};

module.exports.findNguoiDung = async function(context) {
  const sql = `select nd.nguoidung_id "nguoidung_id",
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
    nv.donvi_id "donvi_id",
    r.name "roles",
    r.ID "roles_id"
    from ${process.env.DB_SCHEMA_ADMIN}.nguoidung nd,
    ${process.env.DB_SCHEMA_ADMIN}.nhanvien nv,
    ${process.env.DB_SCHEMA_TTKD}.nguoidung tnd,
    ${process.env.DB_SCHEMA_TTKD}.roles r
    where nd.nguoidung_id=tnd.nguoidung_id(+)
    and nd.nhanvien_id=nv.nhanvien_id
    and tnd.roles_id=r.id(+)
    and nd.nguoidung_id=:nguoidung_id`;
  const rs = await db.execute(sql, context);
  return rs.rows;
};

module.exports.getUserFromToken = async function(context) {
  const result = await db.executeCursor(`${process.env.DB_SCHEMA_TTKD}.get_user_from_token`, context);
  return result;
};

module.exports.getAuthByToken = async function(context) {
  const sql = `select nd.nguoidung_id "nguoidung_id",
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
  tnd.token "token",
  r.name "ten_quyen",
  r.roles "quyen"
  from ${process.env.DB_SCHEMA_ADMIN}.nguoidung nd,
  ${process.env.DB_SCHEMA_ADMIN}.nhanvien nv,
  ${process.env.DB_SCHEMA_TTKD}.nguoidung tnd,
  ${process.env.DB_SCHEMA_TTKD}.roles r
  where nd.nguoidung_id=tnd.nguoidung_id(+)
  and nd.nhanvien_id=nv.nhanvien_id
  and tnd.roles_id=r.id(+)
  and nd.nguoidung_id=:nguoidung_id`;
  const rs = await db.execute(sql, context);
  return rs.rows;
};
