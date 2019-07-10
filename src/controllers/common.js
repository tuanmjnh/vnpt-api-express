const dbapi = require("../db_apis/common");
const helpers = require("../util/helpers");

module.exports.exist = async function(req, res, next) {
  try {
    // check req data
    if (!req.query || !req.query.obj || !req.query.key || !req.query.val) {
      res.status(404).json({ msg: 'exist' });
    }
    const context = {
      v_table: req.query.obj,
      v_column: req.query.key,
      v_value: req.query.val,
      v_condition: req.query.condition || ''
    };
    const result = await dbapi.exist(context);
    res.status(200).json(result.count > 0);
  } catch (err) {
    next(err);
  }
};

module.exports.GenerationSelect = async function(req, res, next) {
  try {
    const data = await dbapi.getTable(req.body);
    let result = 'select ';
    Object.keys(data[0]).forEach(e => {
      result += `\t${e} "${e.toLowerCase()}",\n`;
    });
    result = result.trim().substr(0, result.length - 2);
    result += `\nfrom ${req.body.table} ${req.body.where ? `\nwhere ${req.body.where}` : ''}`;
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
};

module.exports.GenerationModel = async function(req, res, next) {
  try {
    const data = await dbapi.getTable(req.body);
    let result = '{\n';
    Object.keys(data[0]).forEach(e => {
      result += `\t${e.toLowerCase()}: "${e.toUpperCase()}",\n`;
    });
    result = result.trim().substr(0, result.length - 2);
    result += `\n}`;
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
};

module.exports.getColumn = async function(req, res, next) {
  try {
    const data = await dbapi.getColumn({ v_table: req.body.table });
    let table = `module.exports.Table = "${req.body.table.toUpperCase()}"`;
    let key = `module.exports.Key = "ID"`;
    let context = `module.exports.Context = {\n`;
    let get_context = `module.exports.getContext = function (req) {\n\treturn {\n`;
    data.forEach(e => {
      // build context
      context += `\t${e.column_name.toLowerCase()}: "${e.column_name.toUpperCase()}",\n`;
      // build getContext
      get_context += `\t\t${e.column_name.toLowerCase()}: req.body.${e.column_name.toLocaleLowerCase()},\n`;
    });
    // build context
    context = context.trim().substr(0, context.length - 2) + `\n};`;
    // build getContext
    get_context = get_context.trim().substr(0, get_context.length - 2) + `\n\t}\n};`;
    // Result
    const result = `${table}\n\n${key}\n\n${context}\n\n${get_context}`;
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
};

module.exports.transactionList = async function(req, res, next) {
  try {
    const items = []
    for (let index = 0; index < 20; index++) {
      items.push({
        order_no: helpers.NewGuid(),
        timestamp: helpers.RandomDate(new Date(2012, 0, 1), new Date()),
        username: 'name',
        price: (Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4),
        status: Math.random() % 2 === 0 ? 'success' : 'pending'
      })
    }
    res.status(200).json({
      code: 20000,
      data: {
        total: 20,
        items: items
      }
    }).end();
  } catch (err) {
    next(err);
  }
};
