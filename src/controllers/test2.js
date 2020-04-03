const dbapi = require('../db_apis/test2');
const model = require('../models/test');
const helpers = require('../utils/helpers');
module.exports.get = async function(req, res, next) {
  try {
    // check req data
    if (req.params.id) {
      // req.params.id = paresulteInt(req.params.id, 10);
      const result = await dbapi.find({ id: req.params.id });
      if (result && result.length > 0) {
        res
          .status(200)
          .json(result[0])
          .end();
      } else {
        res
          .status(404)
          .json({ msg: 'exist', params: 'data' })
          .end();
      }
    } else {
      if (!req.query.flag) req.query = { flag: 1 };
      const result = await dbapi.all(req.query);
      if (result && result.length > 0) {
        res
          .status(200)
          .json(result)
          .end();
      } else {
        res
          .status(404)
          .json({ msg: 'exist', params: 'data' })
          .end();
      }
    }
    return;
  } catch (err) {
    next(err);
  }
};

module.exports.post = async function(req, res, next) {
  try {
    const body = helpers.body(model.Context, req);
    if (!body.created_by) {
      res
        .status(404)
        .json({ msg: 'exist', params: 'created_by' })
        .end();
      return;
    }
    if (body.time) body.time = new Date(body.time);
    body.created_at = new Date();
    const result = await dbapi.create(body);
    if (result) {
      res
        .status(201)
        .json(result)
        .end();
    } else {
      res
        .status(404)
        .json({ msg: 'exist', params: 'data' })
        .end();
    }
  } catch (err) {
    next(err);
  }
};

module.exports.put = async function(req, res, next) {
  try {
    const body = helpers.body(model.Context, req);
    if (!req.params.id) {
      res
        .status(404)
        .json({ msg: 'exist', params: 'id' })
        .end();
      return;
    } else if (!body.updated_by) {
      res
        .status(404)
        .json({ msg: 'exist', params: 'updated_by' })
        .end();
      return;
    }
    if (body.time) body.time = new Date(body.time);
    body.updated_at = new Date();
    const result = await dbapi.update(req.params.id, body);
    if (result !== null) {
      res
        .status(200)
        .json(result)
        .end();
    } else {
      res
        .status(404)
        .json({ msg: 'exist', params: 'data' })
        .end();
    }
  } catch (err) {
    next(err);
  }
};

module.exports.patch = async function(req, res, next) {
  try {
    if (!Array.isArray(req.body)) req.body = [req.body];
    if (req.body.length < 1) {
      res
        .status(404)
        .json({ msg: 'exist', params: 'data' })
        .end();
      return;
    }
    let result = 0;
    for await (const e of req.body) {
      e.flag = parseInt(e.flag, 10);
      if (e.id && e.deleted_by) {
        // context.push({ id: e.id, flag: e.flag, deleted_by: e.deleted_by, deleted_at: new Date() });
        result += await dbapi.patch(e.id, {
          flag: e.flag,
          deleted_by: e.deleted_by,
          deleted_at: new Date()
        }); // .then((x) => { result += x });
      } // else {
      //   res.status(404).json({ msg: 'exist', params: 'deleted_by' }).end();
      //   return;
      // }
    }
    if (result) {
      res
        .status(200)
        .json(result)
        .end();
    } else {
      res
        .status(404)
        .json({ msg: 'exist', params: 'data' })
        .end();
    }
  } catch (err) {
    next(err);
  }
};

module.exports.delete = async function(req, res, next) {
  try {
    if (req.params.id) {
      const result = await dbapi.delete(req.params.id);
      if (result) {
        res
          .status(200)
          .json(result)
          .end();
      } else {
        res
          .status(404)
          .json({ msg: 'exist', params: 'data' })
          .end();
      }
    } else {
      res
        .status(404)
        .json({ msg: 'exist', params: 'id' })
        .end();
    }
  } catch (err) {
    next(err);
  }
};
