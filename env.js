import * as dotenv from 'dotenv';

dotenv.config();

module.exports = {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  CRON_SECRET_KEY: process.env.CRON_SECRET_KEY,
  APP_PORT: process.env.APP_PORT,
};
