const fs = require('fs');

const public_path = `${process.env.ROOT}\\public`// `${__dirname}\\..\\public\\`;
module.exports.createDir = async function (opts) {
  try {
    const list_dir = opts.dir.replace(/^\/|\/$/g, '').split('/');
    const result = {
      path: public_path,
      list: []
    };
    // create public if not exist
    if (!fs.existsSync(result.path)) await fs.mkdirSync(result.path);
    // loop list path to create
    for await (const e of list_dir) {
      result.path = `${result.path}/${e}/`;
      if (!fs.existsSync(result.path)) {
        await fs.mkdirSync(result.path);
        result.list.push(e);
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.getExtention = function (path, dot = true) {
  if (!path) return ''
  let regx = /(?:\.([^.]+))?$/;
  path = regx.exec(path)
  return path ? (dot ? path[0] : path[1]) : '';
};
