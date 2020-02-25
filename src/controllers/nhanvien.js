const dbapi = require('../db_apis/nhanvien'),
  middleware = require('../services/middleware')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let condition = 'nhanvien_id is not null'
    if (req.query.filter) {
      const filter = `like ${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN('%${req.query.filter}%',1)`
      condition += ` and (${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN(ten_nv,1) ${filter} and ma_nv ${filter})`
    }
    if (req.query.donvi_id) condition += ` and donvi_id=${req.query.donvi_id}`
    if (req.query.donvi_dl_id) condition += ` and donvi_dl_id=${req.query.donvi_dl_id}`
    if (req.query.sortBy) req.query.sortBy = req.query.sortBy.split(',').join('","')
    else req.query.sortBy = '"ma_nv"'
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
