import { AuthenticationError } from "apollo-server-express";
import { IDecodedToken } from "../../Interfaces";

export const verifyUser = (user: IDecodedToken) => {
  if (!user)
    throw new AuthenticationError(
      "You are not authorized to carry out this action!"
    );
};
