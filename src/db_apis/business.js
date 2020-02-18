const db = require('../services/oracle.js')

// APP_KEY "app_key",
const _sql = `SELECT ID "id",
  E.DONVI_ID "donvi_id",
  GROUP_ID "group_id",
  MA_HD "ma_hd",
  TEN_KH "ten_kh",
  DIACHI_KH "diachi_kh",
  MST "mst",
  NGAY_BD "ngay_bd",
  NGAY_KT "ngay_kt",
  SO_LUONG "so_luong",
  TIEN "tien",
  THUE "thue",
  DINH_KEM "dinh_kem",
  NOI_DUNG "noi_dung",
  GHI_CHU "ghi_chu",
  KIEULD_ID "kieuld_id",
  NGAY_TAO "ngay_tao",
  NGUOI_TAO "nguoi_tao",
  IP_TAO "ip_tao",
  NGAY_CN "ngay_cn",
  NGUOI_CN "nguoi_cn",
  IP_CN "ip_cn",
  NGAY_XOA "ngay_xoa",
  NGUOI_XOA "nguoi_xoa",
  IP_XOA "ip_xoa",
  TRANG_THAI "trang_thai",
  NGUOI_DD "nguoi_dd",
  SDT "sdt",
  STK "stk",
  SGT "sgt",
  NGAY_CAP "ngay_cap",
  NOI_CAP "noi_cap",
  NGUOI_GT "nguoi_gt",
  nv.TEN_NV "ten_nguoi_gt"
FROM TTKD_BKN.CONTRACT_ENTERPRISE e,ADMIN_BKN.NHANVIEN nv
WHERE E.NGUOI_GT=nv.NHANVIEN_ID`
module.exports.paging = async function(context, condition) {
  context.v_sql = `${_sql} AND ${condition}`
  const rs = await db.executeCursors('ttkd_bkn.PAGING', context)
  return { data: rs.cursor, rowsNumber: rs.out.v_total }
}

module.exports.getAll = async function(condition) {
  const sql = `${_sql} AND ${condition}`
  const rs = await db.execute(sql)
  return rs.rows
}

module.exports.insert = async function(context) {
  const sql = `INSERT INTO TTKD_BKN.CONTRACT_ENTERPRISE(
    DONVI_ID,GROUP_ID,KIEULD_ID,MA_HD,TEN_KH,DIACHI_KH,NGAY_BD,NGAY_KT,SO_LUONG,DINH_KEM,NOI_DUNG,GHI_CHU,
    TIEN,THUE,MST,SDT,STK,SGT,NGUOI_DD,NGAY_CAP,NOI_CAP,NGUOI_GT,NGAY_TAO,NGUOI_TAO,IP_TAO,TRANG_THAI,ID)
    VALUES(
    :donvi_id,:group_id,:kieuld_id,:ma_hd,:ten_kh,:diachi_kh,:ngay_bd,:ngay_kt,:so_luong,:dinh_kem,:noi_dung,:ghi_chu,
    :tien,:thue,:mst,:sdt,:stk,:sgt,:nguoi_dd,:ngay_cap,:noi_cap,:nguoi_gt,SYSDATE,:nguoi_tao,:ip_tao,:trang_thai,SYS_GUID())
  returning id into :id`
  context.id = { type: 2001, dir: 3003 }// STRING - BIND_OUT
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
  const sql = `UPDATE TTKD_BKN.CONTRACT_ENTERPRISE SET 
  DONVI_ID=:donvi_id,GROUP_ID=:group_id,KIEULD_ID=:kieuld_id,MA_HD=:ma_hd,TEN_KH=:ten_kh,
  DIACHI_KH=:diachi_kh,NGAY_BD=:ngay_bd,NGAY_KT=:ngay_kt,SO_LUONG=:so_luong,DINH_KEM=:dinh_kem,
  NOI_DUNG=:noi_dung,GHI_CHU=:ghi_chu,TIEN=:tien,THUE=:thue,MST=:mst,SDT=:sdt,STK=:stk,SGT=:sgt,
  NGUOI_DD=:nguoi_dd,NGAY_CAP=:ngay_cap,NOI_CAP=:noi_cap,NGUOI_GT=:nguoi_gt,NGAY_CN=SYSDATE,
  NGUOI_CN=:nguoi_cn,IP_CN=:ip_cn,TRANG_THAI=:trang_thai
  WHERE ID=:id`
  const rs = await db.execute(sql, context)
  if (rs.rowsAffected > 0) {
    context.updated_at = new Date()
  } else context = null
  return context
}

module.exports.lock = async function(context) {
  const sql = `UPDATE TTKD_BKN.CONTRACT_ENTERPRISE 
  SET trang_thai=DECODE(trang_thai,1,0,1),IP_XOA=:ip_xoa,NGUOI_XOA=:nguoi_xoa,NGAY_XOA=SYSDATE
  WHERE id=:id`
  const rs = await db.executeMany(sql, context)
  if (rs.rowsAffected > 0) {
    context.deleted_at = new Date()
  } else context = null
  return context
}

module.exports.delete = async function(context) {
  const sql = `DELETE TTKD_BKN.CONTRACT_ENTERPRISE WHERE id=:id`
  const rs = await db.execute(sql, context)
  return rs.rowsAffected
}
