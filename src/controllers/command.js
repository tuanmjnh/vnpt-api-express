const db = require('../services/oracle.js'),
  model = require('../models/command'),
  middleware = require('../services/middleware')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let condition = `flag=${req.query.flag ? req.query.flag : 1}`
    if (req.query.filter) {
      const filter = `like TTKD_BKN.CONVERTTOUNSIGN('%${req.query.filter}%',1)`
      condition += ` and (TTKD_BKN.CONVERTTOUNSIGN(title,1) ${filter} or code ${filter})`
    }
    if (req.query.sortBy) req.query.sortBy = req.query.sortBy.split(',').join('","')
    else req.query.sortBy = '"orders"'
    const sql = model.select()
    if (req.query.page && req.query.rowsPerPage) {
      const context = {
        v_sql: `${sql} WHERE ${condition}`,
        v_offset: parseInt(req.query.page),
        v_limmit: parseInt(req.query.rowsPerPage),
        v_order: `"${req.query.sortBy}"` + (req.query.descending === 'true' ? ' DESC' : ''),
        v_total: { type: 2010, dir: 3002 }
      }
      const rs = await db.executeCursors('ttkd_bkn.PAGING', context)
      if (rs) return res.status(200).json({ data: rs.cursor, rowsNumber: rs.out.v_total }).end()
    } else {
      const rs = await db.execute(`${sql} WHERE ${condition}`)
      if (rs) return res.status(200).json(rs.rows).end()
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
      id: { type: 2001, dir: 3003 }, // BIND_OUT
      key: req.body.key,
      code: req.body.code,
      title: req.body.title,
      orders: req.body.orders,
      flag: req.body.flag
    }
    const rs = await db.execute(model.select(), context)
    if (rs.rowsAffected > 0) {
      context.created_at = new Date()
      context.id = rs.outBinds.id[0]
      return res.status(201).json(context).end()
    }
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
      id: req.body.id,
      type: req.body.type,
      name: req.body.name,
      descs: req.body.descs,
      query: req.body.query,
      color: req.body.color,
      orders: req.body.orders,
      flag: req.body.flag
    }
    const rs = await db.execute(model.update(), context)
    if (rs.rowsAffected > 0) {
      context.updated_at = new Date()
      return res.status(202).json(context).end()
    }
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
      context.push({ id: e.id })
    }
    const sql = 'UPDATE TTKD_BKN.COMMAND SET FLAG=DECODE(flag,1,0,1) WHERE ID=:id'
    const rs = await db.executeMany(sql, context)
    if (rs.rowsAffected > 0) {
      context.deleted_at = new Date()
      return res.status(203).json(context).end()
    }
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
    const rs = await db.execute(model.delete(), context)
    if (rs) return res.status(204).json(rs.rowsAffected).end()
    return res.status(200).json([]).end()
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
