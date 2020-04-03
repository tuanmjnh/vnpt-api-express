const dbapi = require('../db_apis/donvi'),
  dbapiAuth = require('../db_apis/auth');

module.exports.select = async function(req, res, next) {
  try {
    const user = await dbapiAuth.findNguoiDung({ nguoidung_id: req.verify.id });
    let condition = user.length && user[0].donvi_id ? `donvi_id=${user[0].donvi_id}` : '';
    if (req.query.filter) {
      const filter = `like ${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN('%${req.query.filter}%',1)`;
      condition += ` and (${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN(ten_dv,1) ${filter} or 
      diachi_dv ${filter} or so_dt ${filter} or mst ${filter} or stk ${filter} or nguoi_dd ${filter} or chucdanh ${filter})`;
    }
    if (req.query.sortBy) req.query.sortBy = req.query.sortBy.split(',').join('","');
    else req.query.sortBy = '"orders","levels"';
    if (req.query.page && req.query.rowsPerPage) {
      const options = {
        v_sql: condition,
        v_offset: parseInt(req.query.page),
        v_limmit: parseInt(req.query.rowsPerPage),
        v_order: `"${req.query.sortBy}"` + (req.query.descending === 'true' ? ' DESC' : ''),
        v_total: { type: 2010, dir: 3002 }
      };
      const rs = await dbapi.paging(options);
      if (rs) {
        return res
          .status(200)
          .json(rs)
          .end();
      }
    } else {
      const rs = await dbapi.getAll({ condition: condition, order: 'ten_dv' });
      if (rs) {
        return res
          .status(200)
          .json(rs)
          .end();
      }
    }
    return res
      .status(200)
      .json({ rowsNumber: 0, data: [] })
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.find = async function(req, res, next) {
  try {
    if (!req.query.nguoidung_id) {
      const rs = await dbapi.find({ nguoidung_id: req.query.nguoidung_id });
      if (rs) {
        return res
          .status(200)
          .json(rs)
          .end();
      }
      return res
        .status(200)
        .json([])
        .end();
    } else if (!req.query.nhanvien_id) {
      const rs = await dbapi.find({ nhanvien_id: req.query.nhanvien_id });
      if (rs) {
        return res
          .status(200)
          .json(rs)
          .end();
      }
      return res
        .status(200)
        .json([])
        .end();
    } else if (!req.query.ma_nd) {
      const rs = await dbapi.find({ ma_nd: req.query.ma_nd });
      if (rs) {
        return res
          .status(200)
          .json(rs)
          .end();
      }
      return res
        .status(200)
        .json([])
        .end();
    } else if (!req.query.ma_nv) {
      const rs = await dbapi.find({ ma_nv: req.query.ma_nv });
      if (rs) {
        return res
          .status(200)
          .json(rs)
          .end();
      }
      return res
        .status(200)
        .json([])
        .end();
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.getDonviTTKD = async function(req, res, next) {
  try {
    const rs = await dbapi.getDonviTTKD();
    if (rs) {
      return res
        .status(200)
        .json(rs)
        .end();
    }
    return res
      .status(200)
      .json([])
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

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
};

module.exports.update = async function(req, res, next) {
  // try {
  //   const verify = middleware.verify(req, res)
  //   if (!verify) return
  //   // if (!req.body._id) return res.status(500).send('invalid')
  //   if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
  //   const context = {
  //     name: req.body.name,
  //     orders: req.body.orders,
  //     descs: req.body.descs,
  //     updated_by: verify.code,
  //     flag: req.body.flag,
  //     color: req.body.color,
  //     code: req.body.code,
  //     levels: req.body.levels,
  //     roles: req.body.roles,
  //     id: req.body.id
  //   }
  //   const rs = await dbapi.update(context)
  //   if (rs) {
  //     let routes = []
  //     req.body.routes.forEach(e => {
  //       routes.push({
  //         role_id: req.body.id,
  //         route: e
  //       })
  //     })
  //     await dbapi.deleteRoleRoute({ role_id: req.body.id })
  //     await dbapi.insertRoleRoute(routes)
  //     return res.status(202).json(rs).end()
  //   }
  //   return res.status(200).json([]).end()
  // } catch (e) {
  //   console.log(e)
  //   return res.status(500).send('invalid')
  // }
};

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
};

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
};
