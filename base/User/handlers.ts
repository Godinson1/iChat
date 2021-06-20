import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { PHOTO_URL } from "./constants";
import { uploadMedia } from "../Message/helpers";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

import { db } from "../models";

import { jwtSignInUser } from "./index";
import { IRegArgs, IDecodedToken } from "../Interfaces";
import { validateReg, validateLogin, verifyUser } from "../utililties";

const { User } = db;

//Register user
const register = async (args: IRegArgs) => {
  //Destructure  arguments
  const { username, password, email } = args;

  //validate user's input
  const { errors, valid } = validateReg({ username, email, password });
  if (!valid) throw new UserInputError("Failed registering user..", { errors });

  try {
    //Check if user already exist
    //if exist throw error
    const user = await User.findOne({
      where: { username },
    });
    if (user) throw new AuthenticationError("User already exist!");

    /* Create new user
     *  Note - User's password is hashed before creation in the user model
     */
    const data = await User.create({
      username,
      password,
      email,
      photoUrl: PHOTO_URL,
    });

    //Get token
    const token = jwtSignInUser(data);

    //return user with token
    return {
      ...data.toJSON(),
      token,
    };
  } catch (error) {
    //Throw any caught error
    throw error;
  }
};

//Login user
const login = async (args: IRegArgs) => {
  //Destructure  arguments
  const { username, password } = args;

  //validate user's input
  const { errors, valid } = validateLogin({ username, password });
  if (!valid)
    throw new UserInputError("Failed trying to login user..", { errors });

  try {
    //Check if user exist
    //if not throw error
    let user = await User.findOne({
      where: { username },
    });
    if (!user) throw new AuthenticationError("User not found!");

    //Check if password matches that of user..
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      throw new AuthenticationError(
        "Invalid credential. Check your email or password is correct!"
      );

    //Get token
    const token = jwtSignInUser(user);

    //return user and token
    return {
      ...user.toJSON(),
      token,
    };
  } catch (error) {
    //Throw any caught error
    throw error;
  }
};

//Get authenticated user
const getUser = async (user: IDecodedToken) => {
  try {
    verifyUser(user);
    const data = await User.findOne({
      where: { username: user.username },
    });

    return data;
  } catch (error) {
    //Throw any caught error
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

      //Return users data
      return data;
    }
  } catch (error) {
    //Throw any caught error
    throw error;
  }
};

//Upload file
const uploadPhoto = async (file: any, user: IDecodedToken) => {
  try {
    //Verify authenticated user
    verifyUser(user);

    //Find auth user data in database
    let authUser = await User.findOne({
      where: { username: user.username },
    });

    //If not user in database throw error
    if (!authUser) throw new AuthenticationError("User not found");

    //Upload file to google cloud or aws s3 bucket.
    const { filename, createReadStream } = await file;
    const stream = createReadStream();
    const type = "profile";
    const url = await uploadMedia(stream, filename, type);

    if (url) {
      authUser.photoUrl = url;
      const updatedUserWithProfilePhoto = await authUser.save();
      return updatedUserWithProfilePhoto;
    }
  } catch (error) {
    //Throw any caught error
    throw error;
  }
};

export { register, login, getUsers, uploadPhoto, getUser };
