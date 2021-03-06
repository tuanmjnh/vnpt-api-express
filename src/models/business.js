const Model = require('../utils/tm-oracle');

module.exports = new Model(`${process.env.DB_SCHEMA_TTKD}.CONTRACT_ENTERPRISE`, {
  id: { type: String, key: true, auto: true },
  donvi_id: Number,
  group_id: Number,
  kieuld_id: Number,
  ma_hd: String,
  ten_kh: String,
  diachi_kh: String,
  ngay_bd: Date,
  ngay_kt: Date,
  so_luong: Number,
  dinh_kem: String,
  noi_dung: String,
  ghi_chu: String,
  tien: Number,
  thue: Number,
  mst: String,
  sdt: String,
  stk: String,
  sgt: String,
  nguoi_dd: String,
  ngay_cap: Date,
  noi_cap: String,
  nguoi_gt: Number,
  ngay_tao: { type: Date, autoDate: true },
  nguoi_tao: String,
  ip_tao: String,
  ngay_cn: { type: Date, autoDate: true },
  nguoi_cn: String,
  ip_cn: String,
  ngay_xoa: { type: Date, autoDate: true },
  nguoi_xoa: String,
  ip_xoa: String,
  trang_thai: Number
});
