const fs = require('fs'),
  path = require('path');
// const public_path = `${process.env.ROOT_PATH}\\public`// `${__dirname}\\..\\public\\`
// const public_path = path.join(__dirname, `..\\${process.env.PUBLIC_DIR}`)
// module.exports.public_path = public_path
const upload_path = process.env.UPLOAD_DIR;
// module.exports.upload_path = upload_path
// console.log(public_path)
module.exports.createDir = async function(opts) {
  try {
    const list_dir = opts.dir.replace(/^\/|\/$/g, '').split('/');
    const result = {
      path: upload_path,
      list: []
    };
    // create public if not exist
    if (!fs.existsSync(result.path)) await fs.mkdirSync(result.path);
    // loop list path to create
    for await (const e of list_dir) {
      result.path = `${result.path}\\${e}\\`;
      if (!fs.existsSync(result.path)) {
        await fs.mkdirSync(result.path);
        result.list.push(e);
      }
    }
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports.rename = async (oldPath, newPath) => {
  try {
    // if (!fs.existsSync(oldPath)) {
    await fs.renameSync(oldPath, newPath);
    return true;
    // }
    // return false
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports.getExtention = function(path, dot = true) {
  if (!path) return '';
  const regx = /(?:\.([^.]+))?$/;
  path = regx.exec(path);
  return path ? (dot ? path[0] : path[1]) : '';
};

function getFolder(result, prefix = '', root) {
  result = result || [];
  root = root ? `${upload_path}\\${root}` : upload_path;
  const dir = fs.readdirSync(root);
  for (var i in dir) {
    const _path = `${root}\\${dir[i]}`;
    const stat = fs.statSync(_path);
    const item = {
      name: dir[i],
      fullName: `${prefix}/${dir[i]}`,
      size: stat.size,
      ext: path.extname(dir[i]),
      icon: stat.isDirectory() ? 'folder' : 'file'
    };
    result.push(item);
  }
  return result;
}
module.exports.getFolder = getFolder;

function getAllFolder(result, prefix = '', root, directory) {
  result = result || [];
  if (!directory) root = root ? `${upload_path}\\${root}` : upload_path;
  // console.log(root)
  directory = directory || prefix;
  const dir = fs.readdirSync(root);
  for (var i in dir) {
    const _path = `${root}\\${dir[i]}`;
    const stat = fs.statSync(_path);
    const item = {
      name: dir[i],
      fullName: `${prefix}/${dir[i]}`,
      directory: directory,
      fullPath: prefix,
      size: stat.size,
      ext: path.extname(dir[i]),
      icon: stat.isDirectory() ? 'folder' : 'file'
    };
    result.push(item);
    if (stat.isDirectory()) getAllFolder(result, item.fullName, _path, item.name);
  }
  return result;
}
module.exports.getAllFolder = getAllFolder;

function getDirectories(result, prefix = '', root, directory) {
  result = result || [];
  root = root ? `${upload_path}\\${root}` : upload_path;
  const dir = fs.readdirSync(root);
  for (var i in dir) {
    const _path = `${root}\\${dir[i]}`;
    const stat = fs.statSync(_path);
    const item = {
      name: dir[i],
      fullName: `${prefix}/${dir[i]}`,
      directory: directory,
      fullPath: prefix,
      icon: 'folder'
    };
    if (stat.isDirectory()) result.push(item);
  }
  return result;
}
module.exports.getDirectories = getDirectories;

function getAllDirectories(result, prefix = '', root, directory) {
  result = result || [];
  if (!directory) root = root ? `${upload_path}\\${root}` : upload_path;
  directory = directory || prefix;
  const dir = fs.readdirSync(root);
  for (var i in dir) {
    const _path = `${root}\\${dir[i]}`;
    const stat = fs.statSync(_path);
    const item = {
      name: dir[i],
      fullName: `${prefix}/${dir[i]}`,
      directory: directory,
      fullPath: prefix,
      icon: 'folder',
      children: []
    };
    if (stat.isDirectory()) result.push(item);
    if (stat.isDirectory()) getAllDirectories(item.children, item.fullName, _path, item.name);
  }
  return result;
}
module.exports.getAllDirectories = getAllDirectories;

function getFiles(result, dir_path) {
  result = result || [];
  const root = process.env.PUBLIC_DIR;
  const dir = fs.readdirSync(`${root}\\${dir_path}`);
  for (var i in dir) {
    const _path = `${root}\\${dir_path}\\${dir[i]}`;
    const stat = fs.statSync(_path);
    const item = {
      name: dir[i],
      fullName: `${process.env.HOST}/${dir_path}/${dir[i]}`,
      size: stat.size,
      ext: path.extname(dir[i]),
      icon: 'file'
    };
    if (stat.isFile()) result.push(item);
  }
  return result;
}
module.exports.getFiles = getFiles;

function getAllFiles(result, prefix = '', root, directory) {
  result = result || [];
  if (!directory) root = root ? `${upload_path}\\${root}` : upload_path;
  directory = directory || prefix;
  const dir = fs.readdirSync(root);
  for (var i in dir) {
    const _path = `${root}\\${dir[i]}`;
    const stat = fs.statSync(_path);
    const item = {
      name: dir[i],
      fullName: `${prefix}\\${dir[i]}`,
      directory: directory,
      fullPath: prefix,
      size: stat.size,
      ext: path.extname(dir[i]),
      icon: 'file'
    };
    if (stat.isFile()) result.push(item);
    if (stat.isDirectory()) getAllFiles(result, item.fullName, _path, item.name);
  }
  return result;
}
module.exports.getAllFiles = getAllFiles;
