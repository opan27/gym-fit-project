require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  clientWebUrl: process.env.CLIENT_WEB_URL,
  clientMobileUrl: process.env.CLIENT_MOBILE_URL
};

module.exports = config;
