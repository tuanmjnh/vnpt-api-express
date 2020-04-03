const db = require('../services/oracle.js'),
  moment = require('moment');

module.exports.getAllowUpdateTuyenThu = async function(req, res, next) {
  try {
    const rs = moment().date();
    if (rs > 9) {
      return res
        .status(200)
        .json(true)
        .end();
    } else {
      return res
        .status(200)
        .json(false)
        .end();
    }
  } catch (e) {
    return res
      .status(200)
      .json(false)
      .end();
  }
};
module.exports.getTuyenThu = async function(req, res, next) {
  try {
    let sql = `SELECT tt.TUYENTHU_ID "tuyenthu_id",tt.MA_TUYEN "ma_tuyen",tt.TENTUYEN "tentuyen",
    tt.GHICHU "ghichu",tt.MAY_CN "may_cn",tt.NGAY_CN "ngay_cn",tt.NGUOI_CN "nguoi_cn",tt.KIEU "kieu",
    tt.SUDUNG "sudung",tt.KIEUTHU_ID "kieuthu_id",kt.KIEUTHU "kieuthu",tt.HTTT_ID "httt_id",httt.HINHTHUC_TT "hinhthuc_tt",
    nv.NHANVIEN_ID "nhanvien_id",nv.TEN_NV "ten_nv",nv.MA_NV "ma_nv",nv.DONVI_ID "donvi_id",dv.TEN_DV "ten_dv"
    FROM ${process.env.DB_SCHEMA_CSS}.TUYENTHU tt,
    ${process.env.DB_SCHEMA_CSS}.KIEUTHU kt,
    ${process.env.DB_SCHEMA_CSS}.HINHTHUC_TT httt,
    ${process.env.DB_SCHEMA_ADMIN}.NHANVIEN nv,
    ${process.env.DB_SCHEMA_ADMIN}.DONVI dv
    WHERE tt.KIEUTHU_ID=kt.KIEUTHU_ID(+) AND tt.HTTT_ID=httt.HTTT_ID(+) AND tt.NHANVIEN_ID=nv.NHANVIEN_ID AND nv.DONVI_ID=dv.DONVI_ID
    AND tt.SUDUNG=1`;
    if (req.query.filter) {
      const filter = `LIKE ${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN('%${req.query.filter}%',1)`;
      sql += ` AND (${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN(tt.TENTUYEN,1) ${filter} OR tt.MA_TUYEN ${filter}
      OR (${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN(nv.TEN_NV,1) ${filter} OR nv.MA_NV ${filter})`;
    }
    if (req.query.sortBy) req.query.sortBy = req.query.sortBy.split(',').join('","');
    else req.query.sortBy = '"ma_tuyen"';
    if (req.query.donvi_id) req.query.donvi_id = sql += ` AND nv.DONVI_ID=${req.query.donvi_id}`;
    if (req.query.nhanvien_id) req.query.nhanvien_id = sql += ` AND nv.NHANVIEN_ID=${req.query.nhanvien_id}`;
    sql += 'ORDER BY nv.DONVI_ID,nv.NHANVIEN_ID,tt.MA_TUYEN';
    if (req.query.page && req.query.rowsPerPage) {
      const context = {
        v_sql: sql,
        v_offset: parseInt(req.query.page),
        v_limmit: parseInt(req.query.rowsPerPage),
        v_order: `"${req.query.sortBy}"` + (req.query.descending === 'true' ? ' DESC' : ''),
        v_total: { type: 2010, dir: 3002 }
      };
      const rs = await db.executeCursors(`${process.env.DB_SCHEMA_TTKD}.PAGING`, context);
      if (rs) {
        return res
          .status(200)
          .json({ data: rs.cursor, rowsNumber: rs.out.v_total })
          .end();
      }
    } else {
      const rs = await db.execute(sql);
      if (rs) {
        return res
          .status(200)
          .json(rs.rows)
          .end();
      }
    }
    return res
      .status(200)
      .json({ rowsNumber: 0, data: [] })
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.updateTuyenThu = async function(req, res, next) {
  try {
    const context = [];
    if (req.body.tuyenthu_id.length && req.body.nhanvien_id) {
      for (const e of req.body.tuyenthu_id) {
        context.push({ nhanvien_id: req.body.nhanvien_id, tuyenthu_id: e });
      }
    }
    const sql = `UPDATE ${process.env.DB_SCHEMA_CSS}.TUYENTHU SET NHANVIEN_ID=:nhanvien_id WHERE TUYENTHU_ID=:tuyenthu_id`;
    const rs = await db.executeMany(sql, context);
    if (rs) {
      return res
        .status(202)
        .json(rs)
        .end();
    }
    return res
      .status(202)
      .json([])
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};
