const dbapi = require('../db_apis/billing'),
  middleware = require('../services/middleware')

module.exports.getKyCuoc = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    const rs = await dbapi.getKyCuoc()
    if (rs) return res.status(200).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}
