const oracledb = require('oracledb')
const db = require('../services/oracle.js')

// APP_KEY "app_key",
const _sql = `SELECT DONVI_ID "donvi_id",NHANVIEN_ID "nhanvien_id",MA_NV "ma_nv",TEN_NV "ten_nv",
DIACHI_NV "diachi_nv",GIOITINH "gioitinh",CHUCDANH "chucdanh",DONVI_DL_ID "donvi_dl_id",SO_DT "so_dt",
NGAY_SN "ngay_sn",CHUKY "chuky",FLAG "flag",GHICHU "ghichu",TIEN_DC "tien_dc",EMAIL "email",
NGAY_LOGIN "ngay_login",MA_OTP "ma_otp",EMAIL_TMP "email_tmp",TEN_TN "ten_tn",MANV_VNP "manv_vnp",
VITRI_ID "vitri_id",HTHD_ID "hthd_id",OTP "otp",MA_THE "ma_the"
FROM ${process.env.DB_SCHEMA_ADMIN}.NHANVIEN`
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
