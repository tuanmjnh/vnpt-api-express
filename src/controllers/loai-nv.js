const dbapi = require('../db_apis/loai-nv'),
  middleware = require('../services/middleware')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    const params = {}
    const rs = await dbapi.select(params, 'id')
    if (rs) return res.status(200).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}
