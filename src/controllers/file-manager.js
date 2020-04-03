const io = require('../utils/io'),
  multer = require('multer'),
  crypto = require('../utils/crypto');

// Multer functionFiles acceptedn
// multer.none() 0 0
// multer.any() 0+ n
// multer.single() 1 1
// multer.array() 1+ >=1
// multer.fields() 1+ >=1

const storage = multer.diskStorage({
  destination: async function(req, file, cb) {
    const path = req.headers['upload-path'] ? req.headers['upload-path'] : '';
    const create_dir = await io.createDir({ dir: path });
    cb(null, create_dir.path);
  },
  filename: function(req, file, cb) {
    const rename = req.headers['upload-rename'];
    if (rename === 'true') cb(null, crypto.NewGuid('n') + io.getExtention(file.originalname));
    else cb(null, file.originalname);
  }
});
module.exports.storage = storage;

const upload = multer({ storage: storage }).any(); // .array('file-upload')
module.exports.upload = upload;

module.exports.get = async function(req, res, next) {
  try {
    const result = 'File manager';
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

module.exports.post = async function(req, res, next) {
  try {
    const result = []; // await dbapi.create(body);
    const uploadPath = `${process.env.UPLOAD_PATH}/${req.headers['upload-path']}`;
    for (const e of req.files) {
      result.push({
        path: uploadPath,
        size: e.size,
        fileName: e.filename,
        fullName: `${uploadPath}/${e.filename}`,
        ext: io.getExtention(e.filename),
        mimetype: e.mimetype
      });
    }
    if (result) {
      return res
        .status(201)
        .json(result)
        .end();
    }
    return res
      .status(404)
      .json({ msg: 'exist', params: 'data' })
      .end();
  } catch (err) {
    next(err);
  }
};
