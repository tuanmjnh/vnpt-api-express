const db = require('../services/oracle.js'),
  middleware = require('../services/middleware')

module.exports.getKyCuoc = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    const sql = `SELECT KYHOADON_ID "value",KYHOADON "label" FROM ${process.env.DB_SCHEMA_TTKD}.BC_KYHOADON`
    const rs = await db.execute(sql)
    if (rs && rs.rows) return res.status(200).json(rs.rows).end()
    return res.status(200).json([]).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}
