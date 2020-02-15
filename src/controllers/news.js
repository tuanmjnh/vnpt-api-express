const dbapi = require('../db_apis/news'),
  ip = require('../utils/ip'),
  middleware = require('../services/middleware')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let condition = `flag=${req.query.flag ? req.query.flag : 1}`
    if (req.query.filter) {
      const filter = `like TTKD_BKN.CONVERTTOUNSIGN('%${req.query.filter}%',1)`
      condition += ` and (TTKD_BKN.CONVERTTOUNSIGN(title,1) ${filter} or app_key ${filter})`
    }
    if (req.query.key) condition += ` and APP_KEY='${req.query.key}'`
    if (req.query.group_id) condition += ` and group_id='${req.query.group_id}'`
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
      app_key: req.body.app_key,
      group_id: req.body.group_id,
      title: req.body.title,
      icon: req.body.icon,
      image: req.body.image,
      url: req.body.url,
      orders: req.body.orders,
      quantity: req.body.quantity,
      descs: req.body.descs,
      content: req.body.content,
      attach: req.body.attach,
      tags: req.body.tags,
      created_ip: ip.get(req),
      created_by: verify.code,
      flag: req.body.flag
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
      app_key: req.body.app_key,
      group_id: req.body.group_id,
      title: req.body.title,
      icon: req.body.icon,
      image: req.body.image,
      url: req.body.url,
      orders: req.body.orders,
      quantity: req.body.quantity,
      descs: req.body.descs,
      content: req.body.content,
      attach: req.body.attach,
      tags: req.body.tags,
      updated_ip: ip.get(req),
      updated_by: verify.code,
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
      context.push({ id: e, deleted_ip: ip.get(req), deleted_by: verify.code })
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
    if (rs) return res.status(203).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
