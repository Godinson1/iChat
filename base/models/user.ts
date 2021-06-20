"use strict";

import { Model } from "sequelize";
import bcrypt from "bcryptjs";

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model {
    password: string | undefined;
    static associate({ Contact }: any) {
      this.hasMany(Contact, {
        as: "contacts",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      photoUrl: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      hooks: {
        beforeCreate: async function (user: User) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password as string, salt);
        },
      },
    }
  );
  return User;
};
