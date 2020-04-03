const dbapi = require('../db_apis/diaban'),
  dbapiAuth = require('../db_apis/auth'),
  moment = require('moment');

module.exports.getQuan = async function(req, res, next) {
  try {
    const params = {};
    if (req.query.quan_id) params.quan_id = req.query.quan_id;
    if (req.query.quan_id_neo) params.quan_id_neo = req.query.quan_id_neo;
    if (req.query.ma_quan) params.ma_quan = req.query.ma_quan;
    const rs = await dbapi.getQuan(params, 'QUAN_ID');
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

module.exports.getPhuong = async function(req, res, next) {
  try {
    const params = {};
    if (req.query.phuong_id) params.phuong_id = req.query.phuong_id;
    if (req.query.quan_id) params.quan_id = req.query.quan_id;
    if (req.query.phuong_id_neo) params.phuong_id_neo = req.query.phuong_id_neo;
    if (req.query.ma_phuong) params.ma_phuong = req.query.ma_phuong;
    if (req.query.loai) params.loai = req.query.loai;
    if (req.query.loaiphuong) params.loaiphuong = req.query.loaiphuong;
    const rs = await dbapi.getPhuong(params, 'PHUONG_ID');
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

module.exports.getPho = async function(req, res, next) {
  try {
    const user = await dbapiAuth.findNguoiDung({ nguoidung_id: req.verify.id });
    const params = {};
    if (user.length && user[0].donvi_id) params.donviql_id = user[0].donvi_id;
    if (req.query.pho_id && parseInt(req.query.pho_id)) params.pho_id = parseInt(req.query.pho_id);
    if (req.query.nhompho_id && parseInt(req.query.nhompho_id)) params.nhompho_id = parseInt(req.query.nhompho_id);
    if (req.query.pho_id_neo && parseInt(req.query.pho_id_neo)) params.pho_id_neo = parseInt(req.query.pho_id_neo);
    if (req.query.phuong_id && parseInt(req.query.phuong_id)) params.phuong_id = parseInt(req.query.phuong_id);
    if (req.query.loai_nv && parseInt(req.query.loai_nv)) params.loai_nv = parseInt(req.query.loai_nv);
    const rs = await dbapi.getPho(params, null);
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

module.exports.update = async function(req, res, next) {
  try {
    const params = [];
    if (req.body.nhanvien_id && req.body.diaban && req.body.diaban.length) {
      for (const e of req.body.diaban) {
        params.push({ pho_id: e.pho_id, loai_nv: e.loai_nv, nhanvien_id: req.body.nhanvien_id });
      }
    }
    const rs = await dbapi.update(params, null);
    if (rs) {
      return res
        .status(202)
        .json(rs)
        .end();
    }
    return res
      .status(202)
      .json([])
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Tạo dữ liệu phố nhân viên theo kỳ cước
module.exports.createPhoNVKC = async function(req, res, next) {
  try {
    req.body.kycuoc = moment(req.body.kycuoc, 'YYYYMMDD').format('YYYYMMDD');
    if (req.body.kycuoc === 'Invalid date') res.status(500).send('invalid');
    await dbapi.createPhoNVKC({ vkycuoc: req.body.kycuoc });
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Update đơn vị TTKD_BKN.PHO_NV
module.exports.updateDonvi = async function(req, res, next) {
  try {
    await dbapi.updateDonvi();
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Update đơn vị nhân viên, tên nhân viên TTKD_BKN.PHO_NV
module.exports.updateDonviNV = async function(req, res, next) {
  try {
    await dbapi.updateDonviNV();
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Cập nhật PHO_ID dựa theo địa chỉ phố like tên phố
module.exports.updateDBPhoLike = async function(req, res, next) {
  try {
    await dbapi.updateDBPhoLike();
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Cập nhật QUAN_ID dựa vào đơn vị thuê bao
module.exports.updateDBQuan = async function(req, res, next) {
  try {
    await dbapi.updateDBQuan();
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Cập nhật PHUONG_ID dựa vào TTKD_BKN.DB_DONVI và QUAN_ID
module.exports.updateDBPhuong = async function(req, res, next) {
  try {
    await dbapi.updateDBPhuong();
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Cập nhật PHO_ID dựa vào TTKD_BKN.DB_DONVI và PHUONG_ID
module.exports.updateDBPho = async function(req, res, next) {
  try {
    await dbapi.updateDBPho();
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Cập nhật PHO_ID của TINHCUOC_BKN.DBTB_[Kỳ cước] từ PHO_ID của DB_THUEBAO
module.exports.updatePhoCuoc = async function(req, res, next) {
  try {
    req.body.kycuoc = moment(req.body.kycuoc, 'YYYYMMDD').format('YYYYMMDD');
    if (req.body.kycuoc === 'Invalid date') res.status(500).send('invalid');
    const context = { vkycuoc: req.body.kycuoc };
    if (req.body.donvi_id && req.body.donvi_id.length) context.donvi_id = req.body.donvi_id;
    await dbapi.updatePhoCuoc(context);
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

// Cập nhật DOITUONG_ID của TINHCUOC_BKN.DBTB_[Kỳ cước] từ DOITUONG_ID của DB_THUEBAO
module.exports.updateDoiTuongCuoc = async function(req, res, next) {
  try {
    req.body.kycuoc = moment(req.body.kycuoc, 'YYYYMMDD').format('YYYYMMDD');
    if (req.body.kycuoc === 'Invalid date') res.status(500).send('invalid');
    const context = { vkycuoc: req.body.kycuoc };
    if (req.body.donvi_id && req.body.donvi_id.length) context.donvi_id = req.body.donvi_id;
    await dbapi.updateDoiTuongCuoc(context);
    return res
      .status(202)
      .json(true)
      .end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};
