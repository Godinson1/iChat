require("dotenv").config();

module.exports = {
  development: {
    username: process.env.PG_DEV_USER,
    password: process.env.PG_DEV_PASSWORD,
    database: process.env.PG_DEV_DB,
    host: process.env.PG_DEV_HOST,
    dialect: process.env.PG_DIALET,
    logging: false,
  },
  test: {
    username: process.env.PG_DEV_USER,
    password: process.env.PG_DEV_PASSWORD,
    database: process.env.PG_DEV_DB,
    host: process.env.PG_DEV_HOST,
    dialect: process.env.PG_DIALET,
  },
  production: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    host: process.env.PG_HOST,
    dialect: "postgres",
  },
};
