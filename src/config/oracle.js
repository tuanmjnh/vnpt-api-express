module.exports = {
  // hrPool: {
  //   // poolAlias: 'hrPool',
  //   user: process.env.HR_USER,
  //   password: process.env.HR_PASSWORD,
  //   connectString: process.env.HR_CONNECTIONSTRING,
  //   poolMin: 10,
  //   poolMax: 10,
  //   poolIncrement: 0
  // },
  dulieubkn: {
    // poolAlias: 'dulieubkn',
    user: process.env.DB_CONNECT_MAIN_USER.trim(), // 'DULIEU_BKN',
    password: process.env.DB_CONNECT_MAIN_PASSWORD.trim(), // 'vnpt123',
    connectString: `${process.env.DB_CONNECT_MAIN_HOST.trim()}/${process.env.DB_CONNECT_MAIN_DATABASE.trim()}`, // '10.159.136.203/BACKAN',
    poolMin: 1, // let the pool shrink completely
    poolMax: 10, // maximum size of the pool
    poolIncrement: 1, // only grow the pool by one connection at a time
    poolTimeout: 0, // never terminate idle connections
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,
  },
  ttkdbkn: {
    // poolAlias: 'ttkdbkn',
    user: process.env.DB_CONNECT_TTKD_USER.trim(), // 'TTKD_BKN',
    password: process.env.DB_CONNECT_TTKD_PASSWORD.trim(), // 'vnpt@2019',
    connectString: `${process.env.DB_CONNECT_TTKD_HOST.trim()}/${process.env.DB_CONNECT_TTKD_DATABASE.trim()}`, // '10.159.136.203/BACKAN',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0,
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,
  },
  // Knex
  // ttkdbkn_knex: {
  //   host: '10.159.136.203',
  //   user: 'TTKD_BKN',
  //   password: 'vnpt@2019',
  //   database: 'BACKAN',
  //   pool: { min: 0, max: 1 }
  // },
  // dulieubkn_knex: {
  //   host: '10.159.136.203',
  //   user: 'DULIEU_BKN',
  //   password: 'vnpt123',
  //   database: 'BACKAN',
  //   pool: { min: 0, max: 1 }
  // }
};
