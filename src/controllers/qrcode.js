const dbapi = require("../db_apis/qrcode");
const helpers = require("../util/helpers");

module.exports.getHDDT = async function(req, res, next) {
  try {
    // check req data
    if (!req.body.kyhoadon) {
      res.status(404).json({ msg: 'exist', params: 'kydoadon' });
    }
    req.body.kyhoadon = helpers.ToDate(req.body.kyhoadon, 'YYYYMM01')
    // console.log(req.query)
    const result = await dbapi.getHDDT(req.body);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ msg: 'exist', params: 'data' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getKyHoaDon = async function(req, res, next) {
  try {
    const result = await dbapi.getKyHoaDon();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ msg: 'exist', params: 'data' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getHDDTOld = async function(req, res, next) {
  try {
    // check req data
    if (!req.body.kyhoadon || req.body.kyhoadon.length < 3) {
      res.status(404).json({ msg: 'exist', params: 'kydoadon' });
    }
    const context = {
      nam: parseInt(req.body.kyhoadon[0]),
      thang: parseInt(req.body.kyhoadon[1]),
      chuky: parseInt(req.body.kyhoadon[2])
    }
    // console.log(context)
    const result = await dbapi.getHDDTOld(context);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ msg: 'exist', params: 'data' });
    }
  } catch (err) {
    next(err);
  }
};
