"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
module.exports = (sequelize, DataTypes) => {
    class User extends sequelize_1.Model {
        static associate({ Contact }) {
            this.hasMany(Contact, {
                as: "contacts",
                foreignKey: {
                    name: "userId",
                },
            });
        }
    }
    User.init({
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
    }, {
        sequelize,
        modelName: "User",
        tableName: "users",
        hooks: {
            beforeCreate: function (user) {
                return __awaiter(this, void 0, void 0, function* () {
                    const salt = yield bcryptjs_1.default.genSalt(10);
                    user.password = yield bcryptjs_1.default.hash(user.password, salt);
                });
            },
        },
    });
    return User;
};
