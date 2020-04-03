const db = require('../services/oracle.js'),
  model = require('../models/business'),
  ip = require('../utils/ip');

module.exports.select = async function(req, res, next) {
  try {
    let condition = `m.trang_thai=${req.query.flag ? req.query.flag : 1}`;
    if (req.query.filter) {
      const filter = `like ${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN('%${req.query.filter}%',1)`;
      condition += ` and (${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN(m.ten_kh,1) ${filter} and m.ma_hd ${filter} or mst ${filter} or sdt ${filter} or stk ${filter} or sgt ${filter})`;
    }
    if (req.query.ma_hd) condition += ` and m.ma_hd=${req.query.ma_hd}`;
    if (req.query.donvi_id) condition += ` and m.donvi_id=${req.query.donvi_id}`;
    if (req.query.group_id) condition += ` and m.group_id=${req.query.group_id}`;
    if (req.query.nguoi_gt) condition += ` and m.nguoi_gt=${req.query.nguoi_gt}`;
    if (req.query.sortBy) req.query.sortBy = req.query.sortBy.split(',').join('","');
    else req.query.sortBy = '"ngay_tao"';
    const sql = `${model.select('m', 'nv.ten_nv "ten_nguoi_gt"')},${process.env.DB_SCHEMA_ADMIN}.NHANVIEN nv
    WHERE m.NGUOI_GT=nv.NHANVIEN_ID`;
    if (req.query.page && req.query.rowsPerPage) {
      const context = {
        v_sql: `${sql} AND ${condition}`,
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
      const rs = await db.execute(`${sql} WHERE ${condition}`);
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

module.exports.insert = async function(req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    const context = {
      id: { type: 2001, dir: 3003 }, // BIND_OUT
      donvi_id: req.verify.donvi_id,
      group_id: req.body.group_id,
      kieuld_id: req.body.kieuld_id,
      ma_hd: req.body.ma_hd,
      ten_kh: req.body.ten_kh,
      diachi_kh: req.body.diachi_kh,
      ngay_bd: req.body.ngay_bd,
      ngay_kt: req.body.ngay_kt,
      so_luong: req.body.so_luong,
      dinh_kem: req.body.dinh_kem,
      noi_dung: req.body.noi_dung,
      ghi_chu: req.body.ghi_chu,
      tien: parseInt(req.body.tien),
      thue: parseInt(req.body.thue),
      mst: req.body.mst,
      sdt: req.body.sdt,
      stk: req.body.stk,
      sgt: req.body.sgt,
      nguoi_dd: req.body.nguoi_dd,
      ngay_cap: req.body.ngay_cap,
      noi_cap: req.body.noi_cap,
      nguoi_gt: req.body.nguoi_gt,
      ngay_tao: Date.now(),
      nguoi_tao: req.verify.code,
      ip_tao: ip.get(req),
      trang_thai: req.body.trang_thai
    };
    const rs = await db.execute(model.insert(context), context);
    if (rs.rowsAffected > 0) {
      context.ngay_tao = new Date();
      context.id = rs.outBinds.id[0];
      return res
        .status(201)
        .json(context)
        .end();
    }
    return res
      .status(200)
      .json([])
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.update = async function(req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    const context = {
      id: req.body.id,
      donvi_id: req.body.donvi_id,
      group_id: req.body.group_id,
      kieuld_id: req.body.kieuld_id,
      ma_hd: req.body.ma_hd,
      ten_kh: req.body.ten_kh,
      diachi_kh: req.body.diachi_kh,
      ngay_bd: req.body.ngay_bd,
      ngay_kt: req.body.ngay_kt,
      so_luong: req.body.so_luong,
      dinh_kem: req.body.dinh_kem,
      noi_dung: req.body.noi_dung,
      ghi_chu: req.body.ghi_chu,
      tien: req.body.tien,
      thue: req.body.thue,
      mst: req.body.mst,
      sdt: req.body.sdt,
      stk: req.body.stk,
      sgt: req.body.sgt,
      nguoi_dd: req.body.nguoi_dd,
      ngay_cap: req.body.ngay_cap,
      noi_cap: req.body.noi_cap,
      nguoi_gt: req.body.nguoi_gt,
      ngay_cn: Date.now(),
      nguoi_cn: req.verify.code,
      ip_cn: ip.get(req),
      trang_thai: req.body.trang_thai
    };
    const rs = await db.execute(model.update(context), context);
    if (rs.rowsAffected > 0) {
      context.ngay_cn = new Date();
      return res
        .status(202)
        .json(context)
        .end();
    }
    return res
      .status(200)
      .json([])
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.lock = async function(req, res, next) {
  try {
    const context = [];
    for await (let e of req.body.data) {
      context.push({ id: e, ip_xoa: ip.get(req), nguoi_xoa: req.verify.code });
    }
    const sql = `UPDATE ${process.env.DB_SCHEMA_TTKD}.CONTRACT_ENTERPRISE 
    SET trang_thai=DECODE(trang_thai,1,0,1),IP_XOA=:ip_xoa,NGUOI_XOA=:nguoi_xoa,NGAY_XOA=SYSDATE
    WHERE id=:id`;
    const rs = await db.executeMany(sql, context);
    if (rs.rowsAffected > 0) {
      context.deleted_at = new Date();
      return res
        .status(203)
        .json(context)
        .end();
    }
    return res
      .status(200)
      .json([])
      .end();
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.delete = async function(req, res, next) {
  try {
    const context = {
      id: req.body.id
    };
    const rs = await db.execute(model.delete(), context);
    if (rs) {
      return res
        .status(204)
        .json(rs.rowsAffected)
        .end();
    }
    return res
      .status(200)
      .json([])
      .end();
  } catch (e) {
    return res.status(500).send('invalid');
  }
};
