const dbapi = require('../db_apis/hddt'),
  moment = require('moment')

module.exports.getData = async function(req, res, next) {
  try {
    // check req data
    if (!req.query.table) res.status(404).json({ msg: 'exist', params: 'table' })
    // req.body.kyhoadon = moment(req.body.kyhoadon, 'YYYYMM01')
    let khd = req.query.table.split('_')
    khd = khd.length ? parseInt(khd[khd.length - 1]) : ''
    if (!khd) res.status(404).json({ msg: 'exist', params: 'kyhoadon' })
    const context = {
      table: req.query.table,
      ma_tt: req.query.ma_tt
    }
    const result = await dbapi.getData(context)
    if (result.length > 0) {
      res.status(200).json({ khd: khd ? khd : '', data: result })
    } else {
      res.status(404).json({ msg: 'exist', params: 'data' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports.getKyHoaDon = async function(req, res, next) {
  try {
    const result = await dbapi.getKyHoaDon()
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(404).json({ msg: 'exist', params: 'data' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports.getHDDTOld = async function(req, res, next) {
  try {
    // check req data
    if (!req.body.kyhoadon || req.body.kyhoadon.length < 3) {
      res.status(404).json({ msg: 'exist', params: 'kydoadon' })
    }
    const context = {
      nam: parseInt(req.body.kyhoadon[0]),
      thang: parseInt(req.body.kyhoadon[1]),
      chuky: parseInt(req.body.kyhoadon[2])
    }
    // console.log(context)
    const result = await dbapi.getHDDTOld(context)
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(404).json({ msg: 'exist', params: 'data' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports.getTableHDDT = async function(req, res, next) {
  try {
    if (!req.query || !req.query.table) {
      req.query.table = 'HDDT_'
    }
    const result = await dbapi.getTableHDDT(req.query)
    // console.log(result)
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(404).json({ msg: 'exist', params: 'data' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports.getHDDTDULIEU = async function(req, res, next) {
  try {
    // check req data
    if (!req.body.table) {
      res.status(404).json({ msg: 'exist', params: 'table' })
    }
    const result = await dbapi.getHDDTDULIEU(req.body)
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(404).json({ msg: 'exist', params: 'data' })
    }
  } catch (err) {
    next(err)
  }
}
