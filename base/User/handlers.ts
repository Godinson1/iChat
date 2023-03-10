import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { PHOTO_URL } from "./constants";
import { uploadImageCloudinary } from "../Message/helpers";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

import { db } from "../models";

import { jwtSignInUser } from "./index";
import { IRegArgs, IDecodedToken } from "../Interfaces";
import { validateReg, validateLogin, verifyUser } from "../utililties";

const { User } = db;

//Register user
const register = async (args: IRegArgs) => {
  const { username, password, email } = args;
  const { errors, valid } = validateReg({ username, email, password });
  if (!valid) throw new UserInputError("Failed registering user..", { errors });

  try {
    const user = await User.findOne({
      where: { username },
    });
    if (user) throw new AuthenticationError("User already exist!");

    const data = await User.create({
      username,
      password,
      email,
      photoUrl: PHOTO_URL,
    });
    const token = jwtSignInUser(data);

    return { ...data.toJSON(), token };
  } catch (error) {
    throw error;
  }
};

//Login user
const login = async (args: IRegArgs) => {
  const { username, password } = args;

  const { errors, valid } = validateLogin({ username, password });
  if (!valid) throw new UserInputError("Failed trying to login user..", { errors });

  try {
    let user = await User.findOne({ where: { username } });
    if (!user) throw new AuthenticationError("User not found!");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new AuthenticationError("Invalid credential. Check your email or password is correct!");

    const token = jwtSignInUser(user);
    return { ...user.toJSON(), token };
  } catch (error) {
    throw error;
  }
};

//Get authenticated user
const getUser = async (user: IDecodedToken) => {
  try {
    verifyUser(user);
    const data = await User.findOne({ where: { username: user.username } });
    return data;
  } catch (error) {
    throw error;
  }
};

//Get Authenticated users details excluding authenticated user
const getUsers = async (user: IDecodedToken) => {
  try {
    verifyUser(user);
    if (user) {
      let data = await User.findAll({
        where: { username: { [Op.ne]: user.username } },
        order: [["createdAt", "DESC"]],
        attributes: ["username", "createdAt", "photoUrl"],
      });
      return data;
    }
  } catch (error) {
    throw error;
  }
};

//Upload file
const uploadPhoto = async (file: any, user: IDecodedToken) => {
  try {
    verifyUser(user);
    let authUser = await User.findOne({ where: { username: user.username } });
    if (!authUser) throw new AuthenticationError("User not found");

    const { filename, createReadStream } = await file;
    const stream = createReadStream();
    const type = "profile";
    const url = await uploadImageCloudinary(stream, filename, type);

    if (url) {
      authUser.photoUrl = url;
      return authUser.save();
    }
  } catch (error) {
    throw error;
  }
};

export { register, login, getUsers, uploadPhoto, getUser };
