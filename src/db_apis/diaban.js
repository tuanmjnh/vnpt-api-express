const db = require('../services/oracle.js');

module.exports.getQuan = async function (context, order) {
  let sql = `SELECT quan_id "quan_id",ma_quan "ma_quan",ten_quan "ten_quan",quan_id_neo "quan_id_neo",
  tiento "tiento",tinh_id "tinh_id",danso "danso",soho "soho",loai "loai",ghichu "ghichu"
  FROM ${process.env.DB_SCHEMA_CSS}.QUAN WHERE QUAN_ID>0`;
  const keys = Object.keys(context);
  if (keys.length) {
    sql += ' AND ';
    keys.forEach((e) => {
      sql += `${e}=:${e} AND `;
    });
    sql = sql.substr(0, sql.length - 5);
  }
  if (order && order.length) sql += ` ORDER BY ${order}`;
  const rs = await db.execute(sql, context);
  return rs.rows;
};

module.exports.getPhuong = async function (context, order) {
  let sql = `SELECT phuong_id "phuong_id",ma_phuong "ma_phuong",ten_phuong "ten_phuong",quan_id "quan_id",phuong_id_neo "phuong_id_neo",
  thutu "thutu",danso "danso",soho "soho",loai "loai",loaiphuong "loaiphuong",ghichu "ghichu"
  FROM ${process.env.DB_SCHEMA_CSS}.PHUONG WHERE PHUONG_ID>0`;
  const keys = Object.keys(context);
  if (keys.length) {
    sql += ' AND ';
    keys.forEach((e) => {
      sql += `${e}=:${e} AND `;
    });
    sql = sql.substr(0, sql.length - 5);
  }
  if (order && order.length) sql += ` ORDER BY ${order}`;
  const rs = await db.execute(sql, context);
  return rs.rows;
};
module.exports.getPho = async function (context, order) {
  let sql = `SELECT * FROM (SELECT ROWNUM "id",po.PHO_ID "pho_id",po.TEN_PHO "ten_pho",po.NHOMPHO_ID "nhompho_id",po.PHO_ID_NEO "pho_id_neo",
  mp.PHUONG_ID "phuong_id",po.GHICHU "ghichu",nv.NHANVIEN_ID "nhanvien_id",nv.MA_NV "ma_nv",nv.TEN_NV "ten_nv",pv.LOAI_NV "loai_nv",
  lnv.loai_nv "ten_lnv",lnv.color "color",pv.DONVI_ID "donvi_id",pv.DONVIQL_ID "donviql_id"
  FROM ${process.env.DB_SCHEMA_CSS}.PHO po,${process.env.DB_SCHEMA_CSS}.MA_PHO mp,
  ${process.env.DB_SCHEMA_TTKD}.PHO_NV pv,${process.env.DB_SCHEMA_ADMIN}.NHANVIEN nv,
  ${process.env.DB_SCHEMA_TTKD}.LOAI_NV lnv
  WHERE po.PHO_ID=mp.PHO_ID AND po.PHO_ID=pv.PHO_ID(+) AND pv.NHANVIEN_ID=nv.NHANVIEN_ID(+) AND pv.LOAI_NV=lnv.ID(+) AND po.PHO_ID>0
  ORDER BY pv.LOAI_NV,nv.TEN_NV,po.PHO_ID)`;
  const keys = Object.keys(context);
  if (keys.length) {
    sql += ' WHERE ';
    keys.forEach((e) => {
      sql += `"${e}"=:${e} AND `;
    });
    sql = sql.substr(0, sql.length - 5);
  }
  if (order && order.length) sql += ` ORDER BY ${order}`;
  const rs = await db.execute(sql, context);
  return rs.rows;
};

module.exports.find = async function (context) {
  // let sql = `${_sql} WHERE `
  // Object.keys(context).forEach(e => {
  //   sql += `${e}=:${context[e]}`
  // })
  // const rs = await db.execute(sql, context)
  // return rs.rows
};

module.exports.update = async function (context, order) {
  let sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.PHO_NV SET
  NHANVIEN_ID=:nhanvien_id,
  TEN_NV=(SELECT TEN_NV FROM ADMIN_BKN.NHANVIEN WHERE NHANVIEN_ID=:nhanvien_id),
  DONVIQL_ID=(SELECT DONVI_ID FROM ADMIN_BKN.NHANVIEN WHERE NHANVIEN_ID=:nhanvien_id)
  WHERE PHO_ID=:pho_id AND LOAI_NV=:loai_nv`;
  const rs = await db.executeMany(sql, context);
  return rs.rows;
};

// Tạo dữ liệu phố nhân viên theo kỳ cước
module.exports.createPhoNVKC = async function (context, order) {
  let sql = ` -- DROP TABLE IF EXIST
  BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE TTKD_BKN.PHO_NV_'||vkycuoc;
  EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
  END;
  -- CREATE TABLE
  EXECUTE IMMEDIATE 'CREATE TABLE TTKD_BKN.PHO_NV_'||vkycuoc||' (PHO_ID NUMBER,NHANVIEN_ID NUMBER,LOAI_NV NUMBER,DONVIQL_ID NUMBER)';
  -- INSERT DATA
  EXECUTE IMMEDIATE 'INSERT INTO TTKD_BKN.PHO_NV_'||vkycuoc||' SELECT PHO_ID,NHANVIEN_ID,LOAI_NV,DONVIQL_ID FROM TTKD_BKN.PHO_NV';
  COMMIT;`;
  const rs = await db.executeStored(`${process.env.DB_SCHEMA_DULIEU}.BKN_PHO_NV_THANG`, context);
  return rs;
};

// Update đơn vị TTKD_BKN.PHO_NV
module.exports.updateDonvi = async function (context, order) {
  let sql = `UPDATE TTKD_BKN.PHO_NV pv SET PV.DONVI_ID=(SELECT qu.ghichu FROM CSS_BKN.QUAN qu,CSS_BKN.PHUONG ph,CSS_BKN.PHO po,CSS_BKN.MA_PHO mp
    WHERE qu.QUAN_ID=ph.QUAN_ID AND ph.PHUONG_ID=mp.PHUONG_ID AND mp.PHO_ID=po.PHO_ID AND po.PHO_ID=pv.PHO_ID)`;
  const rs = await db.executeStored(`${process.env.DB_SCHEMA_DULIEU}.BKN_DIABAN_UPDATE_DONVI`);
  return rs;
};

// Update đơn vị nhân viên, tên nhân viên TTKD_BKN.PHO_NV
module.exports.updateDonviNV = async function (context, order) {
  let sql = `UPDATE TTKD_BKN.PHO_NV pv SET 
  TEN_NV=(SELECT TEN_NV FROM ADMIN_BKN.NHANVIEN WHERE NHANVIEN_ID=pv.NHANVIEN_ID),
  DONVIQL_ID=(SELECT DONVI_ID FROM ADMIN_BKN.NHANVIEN WHERE NHANVIEN_ID=pv.NHANVIEN_ID)`;
  const rs = await db.executeStored(`${process.env.DB_SCHEMA_DULIEU}.BKN_DIABAN_UPDATE_DONVI_NV`);
  return rs;
};

// Cập nhật PHO_ID dựa theo địa chỉ phố like tên phố
module.exports.updateDBPhoLike = async function (context, order) {
  let sql = `UPDATE CSS_BKN.DIACHI dc SET
  PHO_ID=(SELECT MAX(ph.PHO_ID) FROM CSS_BKN.PHO ph,CSS_BKN.MA_PHO mp
  WHERE dc.PHUONG_ID=MP.PHUONG_ID AND ph.PHO_ID=mp.PHO_ID AND LOWER(dc.DIACHI) LIKE '%'||LOWER(ph.TEN_PHO||' -')||'%')
  WHERE (dc.PHO_ID IS NULL OR dc.PHO_ID=0) AND (DC.PHUONG_ID IS NOT NULL OR dc.PHUONG_ID>0)`;
  const rs = await db.executeStored(
    `${process.env.DB_SCHEMA_DULIEU}.BKN_DIABAN_UPDATE_DB_PHOID_LIKE`,
  );
  return rs;
};

// Cập nhật QUAN_ID dựa vào đơn vị thuê bao
module.exports.updateDBQuan = async function (context, order) {
  let sql = `UPDATE CSS_BKN.DIACHI dc SET 
  QUAN_ID=(SELECT QUAN_ID FROM TTKD_BKN.DB_DONVI dv,CSS_BKN.DIACHI_TB dctb,CSS_BKN.DB_THUEBAO tb
  WHERE dv.DONVI_ID=tb.DONVI_ID AND tb.THUEBAO_ID=DCTB.THUEBAO_ID AND dctb.DIACHI_ID=dc.DIACHI_ID)
  WHERE (QUAN_ID IS NULL OR QUAN_ID=0) AND TINH_ID=4`;
  const rs = await db.executeStored(`${process.env.DB_SCHEMA_DULIEU}.BKN_DIABAN_UPDATE_DB_QUAN_ID`);
  return rs;
};

// Cập nhật PHUONG_ID dựa vào TTKD_BKN.DB_DONVI và QUAN_ID
module.exports.updateDBPhuong = async function (context, order) {
  let sql = `UPDATE CSS_BKN.DIACHI dc SET
  PHUONG_ID=(SELECT PHUONG_ID FROM TTKD_BKN.DB_DONVI WHERE QUAN_ID=dc.QUAN_ID)
  WHERE (PHUONG_ID IS NULL OR PHUONG_ID=0) AND TINH_ID=4`;
  const rs = await db.executeStored(
    `${process.env.DB_SCHEMA_DULIEU}.BKN_DIABAN_UPDATE_DB_PHUONGID`,
  );
  return rs;
};

// Cập nhật PHO_ID dựa vào TTKD_BKN.DB_DONVI và PHUONG_ID
module.exports.updateDBPho = async function (context, order) {
  let sql = `UPDATE CSS_BKN.DIACHI dc SET
  PHO_ID=(SELECT PHO_ID FROM TTKD_BKN.DB_DONVI WHERE PHUONG_ID=dc.PHUONG_ID)
  WHERE (PHO_ID IS NULL OR PHO_ID=0) AND TINH_ID=4`;
  const rs = await db.executeStored(`${process.env.DB_SCHEMA_DULIEU}.BKN_DIABAN_UPDATE_DB_PHOID`);
  return rs;
};

// Cập nhật PHO_ID của TINHCUOC_BKN.DBTB_[Kỳ cước] từ PHO_ID của DB_THUEBAO
module.exports.updatePhoCuoc = async function (context) {
  let sql = `UPDATE(
    SELECT tb.THUEBAO_ID,dc.PHO_ID new,C.PHO_ID old
    FROM ${process.env.DB_SCHEMA_CSS}.DB_THUEBAO tb,${process.env.DB_SCHEMA_CSS}.DIACHI_TB dctb,
    ${process.env.DB_SCHEMA_CSS}.DIACHI dc,${process.env.DB_SCHEMA_TINHCUOC}.DBTB_${context.vkycuoc} c
    WHERE tb.THUEBAO_ID=dctb.THUEBAO_ID AND dctb.DIACHI_ID=dc.DIACHI_ID 
    AND tb.THUEBAO_ID=c.THUEBAO_ID AND dc.PHO_ID!=c.PHO_ID`;
  if (context.donvi_id) sql += ` AND tb.DONVI_ID IN(${context.donvi_id.join(',')})`;
  sql += `)t SET t.old=t.new`;
  // const rs = await db.execute(sql);
  const rs = await db.executeStored(
    `${process.env.DB_SCHEMA_DULIEU}.BKN_DIABAN_UPDATE_PHOID_CUOC`,
    context,
  );
  return rs;
};

// Cập nhật DOITUONG_ID của TINHCUOC_BKN.DBTB_[Kỳ cước] từ DOITUONG_ID của DB_THUEBAO
module.exports.updateDoiTuongCuoc = async function (context) {
  let sql = `UPDATE(
    SELECT tb.THUEBAO_ID,tb.DOITUONG_ID new,C.DOITUONG_ID old
    FROM ${process.env.DB_SCHEMA_CSS}.DB_THUEBAO tb,${process.env.DB_SCHEMA_TINHCUOC}.DBTB_${context.vkycuoc} c
    WHERE tb.THUEBAO_ID=c.THUEBAO_ID AND tb.DOITUONG_ID!=c.DOITUONG_ID`;
  if (context.donvi_id) sql += ` AND tb.DONVI_ID IN(${context.donvi_id.join(',')})`;
  sql += `)t SET t.old=t.new`;
  const rs = await db.execute(sql);
  return rs.rows;
};
