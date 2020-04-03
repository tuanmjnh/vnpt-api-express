const dbapi = require('../db_apis/auth'),
  dbapiRoles = require('../db_apis/roles'),
  middleware = require('../services/middleware');
// const secrets = require('../util/secrets')

// module.exports.get = async function (req, res, next) {
//   try {
//     // check req data
//     if (!req.params.id) res.status(401).json({ msg: 'exist' }).end()
//     req.params.id = parseInt(req.params.id, 10)
//     // Return
//     let rs = await dbapi.getAuthByToken({ nguoidung_id: req.params.id })
//     if (!rs || rs.length < 1) res.status(401).json({ msg: 'exist' }).end()
//     res.status(200).json(rs[0])
//   } catch (err) {
//     next(err)
//   }
// }

module.exports.get = async function(req, res, next) {
  try {
    // check req data
    const rs = await dbapi.findNguoiDung({ nguoidung_id: req.verify.id });
    if (!rs || rs.length < 0) {
      return res
        .status(401)
        .json({ msg: 'exist', params: 'data' })
        .end();
    }
    const roles = await dbapiRoles.selectRoleRoute({ role_id: rs[0].roles_id });
    if (rs) {
      return res
        .status(200)
        .json({ user: rs[0], routes: roles.map(x => x.route) })
        .end();
    } else {
      return res
        .status(401)
        .json({ msg: 'exist', params: 'data' })
        .end();
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.post = async function(req, res, next) {
  try {
    // check req data
    if (!req.body.username) {
      return res
        .status(401)
        .json({ msg: 'exist' })
        .end();
    }
    // throw new Error('wrong')
    let rs = await dbapi.getNguoidung({ username: req.body.username });
    // not exist username
    if (!rs || rs.length < 1) {
      return res
        .status(401)
        .json({ msg: 'exist' })
        .end();
    }
    // check password
    if (rs[0].giaima_mk !== req.body.password) {
      return res
        .status(401)
        .json({ msg: 'wrong' })
        .end();
    }
    // check lock
    if (rs[0].trangthai < 1) {
      return res
        .status(401)
        .json({ msg: 'locked' })
        .end();
    }
    // Token
    const token = middleware.sign({
      id: rs[0].nguoidung_id,
      code: rs[0].ma_nd,
      ma_nv: rs[0].ma_nv,
      donvi_id: rs[0].donvi_id
    });
    // Update last login
    await dbapi.updateAuth({
      // last_login: new Date(),
      // token: token,
      nguoidung_id: rs[0].nguoidung_id
    });
    // Return
    // rs = await dbapi.getAuthByToken({ nguoidung_id: rs[0].nguoidung_id })
    // rs = await dbapi.getUserFromToken({ v_token: token })
    if (rs) return res.status(200).json({ token: token });
    else {
      return res
        .status(401)
        .json({ msg: 'wrong' })
        .end();
    }
  } catch (e) {
    console.log(e);
    // next(e)
    return res.status(500).send('invalid');
  }
};
