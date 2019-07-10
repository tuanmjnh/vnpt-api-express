const fs = require('fs');
const dotenv = require('dotenv');
const logger = require('./logger');

if (fs.existsSync(".env")) {
  if (process.env.NODE_ENV !== "production") {
    logger.debug("Using .env file to supply config environment variables");
  }
  dotenv.config({ path: ".env" });
}
// else {
//   logger.debug("Using .env.example file to supply config environment variables");
//   dotenv.config({ path: ".env.example" }); // you can delete this after you create your own .env file!
// }
const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

const SESSION_SECRET = process.env["SESSION_SECRET"];
const ORACLEDB_URI = prod ? process.env["ORACLEDB_URI"] : process.env["ORACLEDB_URI_LOCAL"];

if (!SESSION_SECRET) {
  logger.error("No client secret. Set SESSION_SECRET environment variable.");
  process.exit(1);
}

if (!ORACLEDB_URI) {
  logger.error("No connection string. Set ORACLEDB_URI environment variable.");
  process.exit(1);
}

module.exports.ENVIRONMENT = ENVIRONMENT;
module.exports.SESSION_SECRET = SESSION_SECRET;
