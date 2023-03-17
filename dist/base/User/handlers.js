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
exports.getUser = exports.uploadPhoto = exports.getUsers = exports.login = exports.register = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const constants_1 = require("./constants");
const helpers_1 = require("../Message/helpers");
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const index_1 = require("./index");
const utililties_1 = require("../utililties");
const { User } = models_1.db;
//Register user
const register = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = args;
    const { errors, valid } = utililties_1.validateReg({ username, email, password });
    if (!valid)
        throw new apollo_server_errors_1.UserInputError("Failed registering user..", { errors });
    try {
        const user = yield User.findOne({
            where: { username },
        });
        if (user)
            throw new apollo_server_errors_1.AuthenticationError("User already exist!");
        const data = yield User.create({
            username,
            password,
            email,
            photoUrl: constants_1.PHOTO_URL,
        });
        const token = index_1.jwtSignInUser(data);
        return Object.assign(Object.assign({}, data.toJSON()), { token });
    }
    catch (error) {
        throw error;
    }
});
exports.register = register;
//Login user
const login = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = args;
    const { errors, valid } = utililties_1.validateLogin({ username, password });
    if (!valid)
        throw new apollo_server_errors_1.UserInputError("Failed trying to login user..", { errors });
    try {
        let user = yield User.findOne({ where: { username } });
        if (!user)
            throw new apollo_server_errors_1.AuthenticationError("User not found!");
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword)
            throw new apollo_server_errors_1.AuthenticationError("Invalid credential. Check your email or password is correct!");
        const token = index_1.jwtSignInUser(user);
        return Object.assign(Object.assign({}, user.toJSON()), { token });
    }
    catch (error) {
        throw error;
    }
});
exports.login = login;
//Get authenticated user
const getUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utililties_1.verifyUser(user);
        const data = yield User.findOne({ where: { username: user.username } });
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.getUser = getUser;
//Get Authenticated users details excluding authenticated user
const getUsers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utililties_1.verifyUser(user);
        if (user) {
            let data = yield User.findAll({
                where: { username: { [sequelize_1.Op.ne]: user.username } },
                order: [["createdAt", "DESC"]],
                attributes: ["username", "createdAt", "photoUrl"],
            });
            return data;
        }
    }
    catch (error) {
        throw error;
    }
});
exports.getUsers = getUsers;
//Upload file
const uploadPhoto = (file, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utililties_1.verifyUser(user);
        let authUser = yield User.findOne({ where: { username: user.username } });
        if (!authUser)
            throw new apollo_server_errors_1.AuthenticationError("User not found");
        const { filename, createReadStream } = yield file;
        const stream = createReadStream();
        const type = "profile";
        const url = yield helpers_1.uploadImageCloudinary(stream, filename, type);
        if (url) {
            authUser.photoUrl = url;
            return authUser.save();
        }
    }
    catch (error) {
        throw error;
    }
});
exports.uploadPhoto = uploadPhoto;
