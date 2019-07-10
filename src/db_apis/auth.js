const oracledb = require('oracledb');
const db = require('../services/oracle.js');

module.exports.getNguoidung = async function (context) {
  const sql = `select nd.nguoidung_id "nguoidung_id",
              nd.ma_nd "ma_nd",
              nd.matkhau "matkhau",
              css_bkn.giaima_mk(nd.matkhau) "giaima_mk",
              nd.trangthai "trangthai"
              from admin_bkn.nguoidung nd,
              ttkd_bkn.nguoidung tnd,
              ttkd_bkn.roles r
              where nd.nguoidung_id=tnd.nguoidung_id(+)
              and tnd.roles_id=r.id(+)
              and nd.ma_nd=:username`;
  const rs = await db.execute(sql, context);
  return rs.rows;
};

module.exports.updateAuth = async function (context) {
  const sql = `update ttkd_bkn.nguoidung set
              last_login=:last_login,
              token=:token
              where nguoidung_id=:nguoidung_id`;
  const rs = await db.execute(sql, context);
  if (rs.rowsAffected && rs.rowsAffected === 1) {
    return true;
  } else {
    return null;
  }
};

module.exports.getUserFromToken = async function (context) {
  const result = await db.executeCursor('ttkd_bkn.get_user_from_token', context);
  return result;
};

module.exports.getAuthByToken = async function (context) {
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
  from admin_bkn.nguoidung nd,
  admin_bkn.nhanvien nv,
  ttkd_bkn.nguoidung tnd,
  ttkd_bkn.roles r
  where nd.nguoidung_id=tnd.nguoidung_id(+)
  and nd.nhanvien_id=nv.nhanvien_id
  and tnd.roles_id=r.id(+)
  and nd.nguoidung_id=:nguoidung_id`;
  const rs = await db.execute(sql, context);
  return rs.rows;
};
