const dbapi = require('../db_apis/roles');

module.exports.select = async function(req, res, next) {
  try {
    let condition = `flag=${req.query.flag ? req.query.flag : 1}`;
    if (req.query.filter) {
      const filter = `like ${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN('%${req.query.filter}%',1)`;
      condition += ` and (${process.env.DB_SCHEMA_TTKD}.CONVERTTOUNSIGN(name,1) ${filter} or code ${filter})`;
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
      const rs = await dbapi.paging(options, condition);
      if (rs) {
        return res
          .status(200)
          .json(rs)
          .end();
      }
    } else {
      const rs = await dbapi.getAll(condition);
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

module.exports.selectRoleRoute = async function(req, res, next) {
  try {
    const rs = await dbapi.selectRoleRoute({ role_id: req.query.role_id });
    if (rs) {
      return res
        .status(200)
        .json(rs.map(x => x.route))
        .end();
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
      const rs = await dbapi.get({ nguoidung_id: req.query.nguoidung_id });
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
      const rs = await dbapi.get({ nhanvien_id: req.query.nhanvien_id });
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
      const rs = await dbapi.get({ ma_nd: req.query.ma_nd });
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
      const rs = await dbapi.get({ ma_nv: req.query.ma_nv });
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

module.exports.insert = async function(req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    const context = {
      name: req.body.name,
      orders: req.body.orders,
      descs: req.body.descs,
      created_by: req.verify.code,
      flag: req.body.flag,
      color: req.body.color,
      code: req.body.code,
      levels: req.body.levels,
      roles: req.body.roles
    };
    const rs = await dbapi.insert(context);
    if (rs) {
      let routes = [];
      req.body.routes.forEach(e => {
        routes.push({
          role_id: rs.id,
          route: e
        });
      });
      await dbapi.insertRoleRoute(routes);
    }
    if (rs) {
      return res
        .status(201)
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

module.exports.update = async function(req, res, next) {
  try {
    // if (!req.body._id) return res.status(500).send('invalid')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    const context = {
      name: req.body.name,
      orders: req.body.orders,
      descs: req.body.descs,
      updated_by: req.verify.code,
      flag: req.body.flag,
      color: req.body.color,
      code: req.body.code,
      levels: req.body.levels,
      roles: req.body.roles,
      id: req.body.id
    };
    const rs = await dbapi.update(context);
    if (rs) {
      let routes = [];
      req.body.routes.forEach(e => {
        routes.push({
          role_id: req.body.id,
          route: e
        });
      });
      await dbapi.deleteRoleRoute({ role_id: req.body.id });
      await dbapi.insertRoleRoute(routes);
      return res
        .status(202)
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

module.exports.lock = async function(req, res, next) {
  try {
    const context = [];
    for await (let e of req.body.data) {
      context.push({ id: e });
    }
    const rs = await dbapi.lock(context);
    if (rs) {
      return res
        .status(203)
        .json(rs)
        .end();
    }
    return res
      .status(200)
      .json([])
      .end();
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.delete = async function(req, res, next) {
  try {
    const context = {
      id: req.body.id
    };
    const rs = await dbapi.delete(context);
    if (rs) {
      return res
        .status(204)
        .json(rs)
        .end();
    }
    return res
      .status(200)
      .json([])
      .end();
  } catch (e) {
    return res.status(500).send('invalid');
  }
};
