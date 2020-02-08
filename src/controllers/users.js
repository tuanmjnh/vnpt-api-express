const dbapi = require('../db_apis/users'),
  middleware = require('../services/middleware')

module.exports.select = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    let condition = `trangthai>=${!req.query.trangthai ? 1 : req.query.trangthai}`
    if (req.query.filter) {
      const filter = `like TTKD_BKN.CONVERTTOUNSIGN('%${req.query.filter}%',1)`
      condition += ` and (ma_nd ${filter} or TTKD_BKN.CONVERTTOUNSIGN(ten_nd,1) ${filter} or ma_nv ${filter} or TTKD_BKN.CONVERTTOUNSIGN(ten_nv,1) ${filter})`
    }
    if (req.query.sortBy) req.query.sortBy = req.query.sortBy.split(',').join('","')
    else req.query.sortBy = '"ma_nd"'
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

module.exports.find = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    if (req.query.nguoidung_id) {
      const rs = await dbapi.find({ nguoidung_id: req.query.nguoidung_id })
      if (rs) return res.status(200).json(rs).end()
      return res.status(200).json([]).end()
    } else if (req.query.nhanvien_id) {
      const rs = await dbapi.find([])
      if (rs) return res.status(200).json(rs).end()
      return res.status(200).json([]).end()
    } else if (req.query.ma_nd) {
      const rs = await dbapi.find({ ma_nd: req.query.ma_nd })
      if (rs) return res.status(200).json(rs).end()
      return res.status(200).json([]).end()
    } else if (req.query.ma_nv) {
      const rs = await dbapi.find({ ma_nv: req.query.ma_nv })
      if (rs) return res.status(200).json(rs).end()
      return res.status(200).json([]).end()
    } else if (req.query.donvi_id) {
      const rs = await dbapi.find({ donvi_id: req.query.donvi_id })
      if (rs) return res.status(200).json(rs).end()
      return res.status(200).json([]).end()
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.getPassword = async function(req, res, next) {
  try {
    if (!middleware.verify(req, res)) return
    const rs = await dbapi.getPassword({ ma_nd: req.query.ma_nd })
    if (rs) return res.status(200).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.insert = async function(req, res, next) {
  // try {
  //   const verify = middleware.verify(req, res)
  //   if (!verify) return
  //   if (!req.body || Object.keys(req.body).length < 1 || !req.body.email) {
  //     return res.status(500).send('invalid')
  //   }
  //   const x = await Model.findOne({ email: req.body.email })
  //   if (x) return res.status(501).send('exist')
  //   const password = crypto.NewGuid().split('-')[0]
  //   req.body.salt = crypto.NewGuid('n')
  //   req.body.password = crypto.md5(password + req.body.salt)
  //   req.body.created = { at: new Date(), by: verify._id, ip: ip.get(req) }
  //   const data = new Model(req.body)
  //   data.validate()
  //   data.save((e, rs) => {
  //     if (e) return res.status(500).send(e)
  //     rs.password = password
  //     // Push logs
  //     logs.push(req, { user_id: verify._id, collection: 'users', collection_id: rs._id, method: 'insert' })
  //     return res.status(201).json(rs)
  //   })
  // } catch (e) {
  //   return res.status(500).send('invalid')
  // }
}

module.exports.update = async function(req, res, next) {
  // try {
  //   const verify = middleware.verify(req, res)
  //   if (!verify) return
  //   // if (!req.body._id) return res.status(500).send('invalid')
  //   if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
  //   if (mongoose.Types.ObjectId.isValid(req.body._id)) {
  //     Model.updateOne({ _id: req.body._id }, {
  //       $set: {
  //         full_name: req.body.full_name,
  //         phone: req.body.phone,
  //         person_number: req.body.person_number,
  //         region: req.body.region,
  //         avatar: req.body.avatar,
  //         note: req.body.note,
  //         date_birth: req.body.date_birth,
  //         roles: req.body.roles
  //       }
  //     }, (e, rs) => { // { multi: true, new: true },
  //       if (e) return res.status(500).send(e)
  //       // Push logs
  //       logs.push(req, { user_id: verify._id, collection: 'users', collection_id: req.body._id, method: 'update' })
  //       return res.status(202).json(rs)
  //     })
  //   } else {
  //     return res.status(500).send('invalid')
  //   }
  // } catch (e) {
  //   return res.status(500).send('invalid')
  // }
}

module.exports.resetPassword = async function(req, res, next) {
  // try {
  //   const verify = middleware.verify(req, res)
  //   if (!verify) return
  //   if (mongoose.Types.ObjectId.isValid(req.body._id)) {
  //     // Find user by id
  //     const x = await Model.findById(req.body._id)
  //     if (!x) return res.status(404).send('no_exist')
  //     // Generate password
  //     const password = crypto.NewGuid().split('-')[0]
  //     Model.updateOne({ _id: req.body._id }, { $set: { password: crypto.md5(password + x.salt) } }, (e, rs) => {
  //       if (e) return res.status(500).send(e)
  //       // Push logs
  //       logs.push(req, { user_id: verify._id, collection: 'users', collection_id: req.body._id, method: 'reset-password' })
  //       res.status(206).json({ password: password })
  //     })
  //   } else {
  //     return res.status(500).send('invalid')
  //   }
  // } catch (e) {
  //   return res.status(500).send('invalid')
  // }
}

module.exports.lock = async function(req, res, next) {
  // try {
  //   const verify = middleware.verify(req, res)
  //   if (!verify) return
  //   let rs = { success: [], error: [] }
  //   for await (let _id of req.body._id) {
  //     // if (!validate.isBoolean(req.body.disabled)) {
  //     //   rs.error.push(id)
  //     //   continue
  //     // }
  //     const x = await Model.findById(_id)
  //     if (x) {
  //       var _x = await Model.updateOne({ _id: _id }, { $set: { enable: x.enable === true ? false : true } })
  //       if (_x.nModified) {
  //         rs.success.push(_id)
  //         // Push logs
  //         logs.push(req, { user_id: verify._id, collection: 'users', collection_id: _id, method: (x.enable === true ? 'lock' : 'unlock') })
  //       } else rs.error.push(_id)
  //     }
  //   }
  //   return res.status(203).json(rs)
  //   // if (!validate.isBoolean(req.body.disabled)) return res.status(500).send('invalid')
  //   // if (mongoose.Types.ObjectId.isValid(req.params.id)) {
  //   //   Model.updateOne({ _id: req.params.id }, { $set: { disabled: req.body.disabled } }, (e, rs) => {
  //   //     if (e) return res.status(500).send(e)
  //   //     if (!rs) return res.status(404).send('no_exist')
  //   //     return res.status(203).json(rs)
  //   //   })
  //   // } else {
  //   //   return res.status(500).send('invalid')
  //   // }
  // } catch (e) {
  //   return res.status(500).send('invalid')
  // }
}

module.exports.verified = async function(req, res, next) {
  // try {
  //   const verify = middleware.verify(req, res)
  //   if (!verify) return
  //   if (!validate.isBoolean(req.body.verified)) return res.status(500).send('invalid')
  //   if (mongoose.Types.ObjectId.isValid(req.body._id)) {
  //     Model.updateOne({ _id: req.body._id }, { $set: { verified: req.body.verified } }, (e, rs) => {
  //       if (e) return res.status(500).send(e)
  //       // Push logs
  //       logs.push(req, { user_id: verify._id, collection: 'users', collection_id: req.body._id, method: 'verified' })
  //       return res.status(205).json(rs)
  //     })
  //   } else {
  //     return res.status(500).send('invalid')
  //   }
  // } catch (e) {
  //   return res.status(500).send('invalid')
  // }
}

module.exports.setRoles = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    // if (!req.body._id) return res.status(500).send('invalid')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    const context = {
      nguoidung_id: req.body.nguoidung_id,
      roles_id: req.body.roles_id
    }
    const rs = await dbapi.setRoles(context)
    if (rs) return res.status(202).json(rs).end()
    return res.status(200).json([]).end()
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.delete = async function(req, res, next) {
  // try {
  //   const verify = middleware.verify(req, res)
  //   if (!verify) return
  //   if (mongoose.Types.ObjectId.isValid(req.params._id)) {
  //     Model.deleteOne({ _id: req.params._id }, (e, rs) => {
  //       if (e) return res.status(500).send(e)
  //       // Push logs
  //       logs.push(req, { user_id: verify._id, collection: 'users', collection_id: req.params._id, method: 'delete' })
  //       return res.status(204).json(rs)
  //     })
  //   } else {
  //     return res.status(500).send('invalid')
  //   }
  // } catch (e) {
  //   return res.status(500).send('invalid')
  // }
}
