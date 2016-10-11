require('dotenv').config({
  silent: true
});

const NAME = 'api-boilerplate';
const ENV = process.env.NODE_ENV || 'development';
const DEV = ENV === 'development';

module.exports = {
  NAME: NAME,
  ENV: ENV,
  DEV: DEV,
  SHOW_ERRORS: process.env.SHOW_ERRORS || DEV,
  PRETTY_PRINT: process.env.PRETTY_PRINT || DEV,
  HTTP_HOST: process.env.HTTP_HOST || '0.0.0.0',
  HTTP_PORT: process.env.HTTP_PORT || 8080,
  DEBUG_SQL: process.env.DEBUG_SQL,
  db: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGNAME || process.env.DB_NAME || NAME,
    user: process.env.PGUSER,
    password: process.env.PGPASS
  }
};
