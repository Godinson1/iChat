export {};
("use strict");

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db: any = {};

let sequelize: any;
sequelize = new Sequelize(process.env.PG_URL);

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts";
  })
  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };
