require('./utils/prototypes');
require('./config');

const express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  session = require('express-session'),
  flash = require('express-flash'),
  compression = require('compression'),
  lusca = require('lusca'),
  oracleDB = require('./services/oracle.js'),
  router = require('./router'),
  middleware = require('./services/middleware');

// console.log(process.env.ROOT_PATH)
// if (process.env.NODE_ENV.toString() === 'development') dotenv.config({ path: '.env.development' })
// else dotenv.config({ path: '.env' })

// if (process.env.NODE_ENV !== 'production') {
//   process.env.BASE_URL = '/'
// }
// Connection oracleDB
oracleDB.initialize();
// app express
const app = express();
// trust proxy ip
app.set('trust proxy', true);
// static public
// app.use(express.static(process.env.PUBLIC_PATH, { maxAge: 31557600000 }))
// app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(`${process.env.BASE_URL}${process.env.PUBLIC_PATH}`, express.static(process.env.PUBLIC_DIR));
app.use(`${process.env.BASE_URL}${process.env.STATIC_PATH}`, express.static(process.env.STATIC_DIR));
app.use(`${process.env.BASE_URL}${process.env.UPLOAD_PATH}`, express.static(process.env.UPLOAD_DIR));
// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// CORS middleware
app.use(cors());
app.options('*', cors());
// compression
app.use(compression());
// secret variable
app.set('secret', process.env.SECRET);
// session
// app.use(express.session({ cookie: { maxAge: 60000 } }))
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET
    // store: new MongoStore({
    //   url: mongoUrl,
    //   autoReconnect: true
    // })
  })
);
// flash
app.use(flash());
// lusca
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// Error Handler. Provides full stack - remove for production
// if (process.env.NODE_ENV !== 'production') {
//   const errorHandler = require('errorHandler');
//   app.use(errorHandler());
// }

// middleware
app.use(middleware.verify);

/**
 * Primary app routes.
 */
/* GET home page. */
app.get(process.env.BASE_URL, function (req, res, next) {
  // res.render('index', { title: 'Express' })
  res.end(`VNPT Express Server api. version: ${process.env.npm_package_version}`);
});
// Mount the router at /api so all its routes start with /api
app.use(`${process.env.BASE_URL}api`, router);

var port = process.env.PORT || 8001;
// listen
const server = app
  .listen(port)
  .on('listening', () => {
    console.log(`Web server listening on: ${process.env.HOST}`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
    console.log(`BASE_URL: ${process.env.BASE_URL}`);
    console.log(`SECRET: ${process.env.SECRET}`);
  })
  .on('error', (err) => {
    console.log(err);
  });
