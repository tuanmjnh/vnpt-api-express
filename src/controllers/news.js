const db = require('../services/oracle.js'),
  model = require('../models/news'),
  ip = require('../utils/ip'),
  middleware = require('../services/middleware')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let condition = `flag=${req.query.flag ? req.query.flag : 1}`
    if (req.query.filter) {
      const filter = `like ${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN('%${req.query.filter}%',1)`
      condition += ` and (${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN(title,1) ${filter} or app_key ${filter})`
    }
    if (req.query.key) condition += ` and APP_KEY='${req.query.key}'`
    if (req.query.group_id) condition += ` and group_id='${req.query.group_id}'`
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
      const rs = await db.executeCursors(`${process.env.DB_SCHEMA_TTKD}.PAGING`, context)
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
      tags: req.body.tags,
      attach: req.body.attach,
      created_ip: ip.get(req),
      created_by: verify.code,
      flag: req.body.flag
    }
    const rs = await db.execute(model.insert(context), context)
    if (rs.rowsAffected > 0) {
      context.created_at = new Date()
      context.id = rs.outBinds && rs.outBinds.id ? rs.outBinds.id[0] : null
      return res.status(201).json(context).end()
    }
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
    const rs = await db.execute(model.update(context), context)
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
      context.push({ id: e, deleted_ip: ip.get(req), deleted_by: verify.code })
    }
    const sql = `UPDATE ${model.name} SET flag=DECODE(flag,1,0,1),deleted_ip=:deleted_ip,deleted_by=:deleted_by,deleted_at=SYSDATE
    WHERE id=:id`
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
