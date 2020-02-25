const dbapi = require('../db_apis/types'),
  middleware = require('../services/middleware')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let condition = `flag=${req.query.flag ? req.query.flag : 1}`
    if (req.query.filter) {
      const filter = `like ${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN('%${req.query.filter}%',1)`
      condition += ` and (${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN(title,1) ${filter} or code ${filter})`
    }
    if (req.query.sortBy) req.query.sortBy = req.query.sortBy.split(',').join('","')
    else req.query.sortBy = '"orders"'
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

module.exports.insert = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body || Object.keys(req.body).length < 1 || !req.body.email) {
      return res.status(500).send('invalid')
    }
    const context = {
      key: req.body.key,
      code: req.body.code,
      title: req.body.title,
      orders: req.body.orders,
      flag: req.body.flag
    }
    const rs = await dbapi.insert(context)
    if (rs) return res.status(201).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.update = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const context = {
      key: req.body.key,
      code: req.body.code,
      title: req.body.title,
      orders: req.body.orders,
      flag: req.body.flag
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
      context.push({ key: e.key, code: e.code })
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
      key: req.body.key,
      code: req.body.code
    }
    const rs = await dbapi.delete(context)
    if (rs) return res.status(204).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
