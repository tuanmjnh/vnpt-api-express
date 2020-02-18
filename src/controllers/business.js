const dbapi = require('../db_apis/business'),
  ip = require('../utils/ip'),
  middleware = require('../services/middleware')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let condition = `trang_thai=${req.query.flag ? req.query.flag : 1}`
    if (req.query.filter) {
      const filter = `like TTKD_BKN.CONVERTTOUNSIGN('%${req.query.filter}%',1)`
      condition += ` and (TTKD_BKN.CONVERTTOUNSIGN(ten_kh,1) ${filter} and ma_hd ${filter} or mst ${filter} or sdt ${filter} or stk ${filter} or sgt ${filter})`
    }
    if (req.query.ma_hd) condition += ` and e.ma_hd=${req.query.ma_hd}`
    if (req.query.donvi_id) condition += ` and e.donvi_id=${req.query.donvi_id}`
    if (req.query.group_id) condition += ` and e.group_id=${req.query.group_id}`
    if (req.query.nguoi_gt) condition += ` and e.nguoi_gt=${req.query.nguoi_gt}`
    if (req.query.sortBy) req.query.sortBy = req.query.sortBy.split(',').join('","')
    else req.query.sortBy = '"ngay_tao"'
    if (req.query.page && req.query.rowsPerPage) {
      const options = {
        v_sql: condition,
        v_offset: parseInt(req.query.page),
        v_limmit: parseInt(req.query.rowsPerPage),
        v_order: `"${req.query.sortBy}"` + (req.query.descending === 'true' ? ' DESC' : ''),
        v_total: { type: 2010, dir: 3002 }
      }
      const rs = await dbapi.paging(options, condition)
      if (rs) return res.status(200).json(rs).end()
    } else {
      const rs = await dbapi.getAll(condition)
      if (rs) return res.status(200).json(rs).end()
    }
    return res.status(200).json({ rowsNumber: 0, data: [] }).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.getKey = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    const rs = await dbapi.getKey()
    if (rs) return res.status(200).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.insert = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const context = {
      donvi_id: verify.donvi_id,
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
      nguoi_tao: verify.code,
      ip_tao: ip.get(req),
      trang_thai: req.body.trang_thai
    }
    const rs = await dbapi.insert(context)
    if (rs) return res.status(201).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.update = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
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
      nguoi_cn: verify.code,
      ip_cn: ip.get(req),
      trang_thai: req.body.trang_thai
    }
    const rs = await dbapi.update(context)
    if (rs) return res.status(202).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.lock = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    const context = []
    for await (let e of req.body.data) {
      context.push({ id: e, ip_xoa: ip.get(req), nguoi_xoa: verify.code })
    }
    const rs = await dbapi.lock(context)
    if (rs) return res.status(203).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.delete = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    const context = {
      id: req.body.id
    }
    const rs = await dbapi.delete(context)
    if (rs) return res.status(203).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
