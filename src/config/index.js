const path = require('path');
const dotenv = require('dotenv');

// dotenv
// dotenv.config({ path: `.env.${process.env.NODE_ENV.toString()}` });
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';
if (process.env.NODE_ENV && process.env.NODE_ENV.toString().trim() === 'development') {
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config({ path: '.env' });
}
// Root path
process.env.ROOT_PATH = __dirname;
process.env.PUBLIC_DIR = path.join(process.env.ROOT_PATH, process.env.PUBLIC_PATH); // `${process.env.ROOT_PATH}/${process.env.PUBLIC_PATH}`
process.env.STATIC_DIR = path.join(process.env.PUBLIC_DIR, process.env.STATIC_PATH);
process.env.UPLOAD_DIR = path.join(process.env.PUBLIC_DIR, process.env.UPLOAD_PATH);
process.env.PORT = process.env.PORT || 8001;

// console.log(process.env.DB_SCHEMA_ADMIN)
// console.log(process.env.DB_SCHEMA_DULIEU)
// console.log(process.env.DB_SCHEMA_CSS)
// console.log(process.env.DB_SCHEMA_BCSS)
// console.log(process.env.DB_SCHEMA_BSC)
// console.log(process.env.DB_SCHEMA_HDDT)
// console.log(process.env.DB_SCHEMA_QLSC)
// console.log(process.env.DB_SCHEMA_QLTB)
// console.log(process.env.DB_SCHEMA_QLTN)
// console.log(process.env.DB_SCHEMA_QLVT)
// console.log(process.env.DB_SCHEMA_TINHCUOC)
// console.log(process.env.DB_SCHEMA_TTKD)
