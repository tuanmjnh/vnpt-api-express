const Model = require('../utils/tm-oracle');

module.exports = Model(`${process.env.DB_SCHEMA_TTKD}.HDDT_`, {
  thang: Number,
  nam: Number,
  chuky: Number,
  ten_tt: String,
  ms_thue: String,
  donvi_id: Number,
  diachi_tt: String,
  sodaidien: String,
  dienthoai_lh: String,
  ma_tt: String,
  cuoc_cthue: Number,
  cuoc_kthue: Number,
  tien_km: Number,
  cktm: Number,
  ht_vtci: Number,
  tien: Number,
  vat: Number,
  tong: Number,
  cantru: Number,
  tong_pt: Number,
  manv_tc: String,
  thanhtoan_id: Number,
  tuyenthu: String,
  ma_tt_neo: String,
  fkey: String,
  hinhthuc_tt: String,
  stt: Number,
  seri: Number,
  kh_seri: String,
  qrcode: String,
  ten_donvi: String,
  ten_donvi_ql: String,
  stk: String,
  pattern: String
});
