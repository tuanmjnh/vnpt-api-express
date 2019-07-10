const jwt = require('jsonwebtoken');
const dbapi = require("../db_apis/auth");
// const secrets = require('../util/secrets');

// module.exports.get = async function (req, res, next) {
//   try {
//     // check req data
//     if (!req.params.id) res.status(401).json({ msg: "exist" }).end();
//     req.params.id = parseInt(req.params.id, 10);
//     // Return
//     let rs = await dbapi.getAuthByToken({ nguoidung_id: req.params.id });
//     if (!rs || rs.length < 1) res.status(401).json({ msg: "exist" }).end();
//     res.status(200).json(rs[0]);
//   } catch (err) {
//     next(err);
//   }
// }

module.exports.get = async function(req, res, next) {
  try {
    // check req data
    if (!req.headers.authorization) {
      res.status(401).json({ msg: 'exist', params: 'token' });
    }
    const result = await dbapi.getUserFromToken({ v_token: req.headers.authorization });
    if (result) {
      res.status(200).json(result).end();
    } else {
      res.status(401).json({ msg: 'exist', params: 'data' }).end();
    }
  } catch (err) {
    next(err);
  }
};

module.exports.post = async function(req, res, next) {
  try {
    // check req data
    if (!req.body.username) res.status(401).json({ msg: "wrong" }).end();
    // throw new Error("wrong")
    let rs = await dbapi.getNguoidung({ username: req.body.username });
    // not exist username
    if (!rs || rs.length < 1) res.status(401).json({ msg: "wrong" }).end();
    // check password
    if (rs[0].giaima_mk !== req.body.password) res.status(401).json({ msg: "wrong" }).end();
    // check lock
    if (rs[0].trangthai < 1) res.status(401).json({ msg: "locked" }).end();
    // Token
    const token = jwt.sign({ username: req.body.username },
      process.env["SESSION_SECRET"], { expiresIn: '24h' } // expires in 24 hours
    );
    // Update last login
    await dbapi.updateAuth({
      last_login: new Date(),
      token: token,
      nguoidung_id: rs[0].nguoidung_id
    });
    // Return
    // rs = await dbapi.getAuthByToken({ nguoidung_id: rs[0].nguoidung_id });
    // rs = await dbapi.getUserFromToken({ v_token: token });
    if (rs) {
      res.status(200).json({
        uid: rs[0].nguoidung_id,
        token: token
      });
    } else {
      res.status(401).json({ msg: "wrong" }).end();
    }
  } catch (err) {
    next(err);
  }
}
