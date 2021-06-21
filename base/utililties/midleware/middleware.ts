import { PubSub } from "apollo-server-express";
import { IUser, IDecodedToken, ExpressContext } from "../../Interfaces";
import jwt from "jsonwebtoken";

//create a new instance of the subscription PubSub
const pubsub = new PubSub();

//Reason why you might not want to throw error here is because
//Some resolvers that does not require auth are connected in the context middleware
//Hence if you throw error or auth check. it will affect such resolvers.
//Examples of such in this case are Register and Login Resolvers
export const auth = async (ctx: ExpressContext) => {
  //Initialize token variable and set to empty string
  let token: string = "";

  //check if the context has the header[authorization]
  //and also connection for subscriptions
  if (ctx.req && ctx.req.headers.authorization) {
    token = ctx.req.headers.authorization?.split("Bearer ")[1] as string;
  } else if (ctx.connection && ctx.connection.context.Authorization) {
    token = ctx.connection.context.Authorization?.split("Bearer ")[1] as string;
  }

  //Verify token passed by user and decode it.

  if (token) {
    jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decodedToken) => {
      //Set the authenticated user in user context
      if (err) console.log(err);
      console.log(decodedToken);
      console.log("secret", process.env.JWT_SECRET);
      ctx.user = decodedToken as IDecodedToken;
    });
    console.log("user", ctx.user);
  }

  //Set the pubsub as pubsub in the context
  ctx.pubsub = pubsub;

  //Return context
  return ctx;
};

//A function that returns user token
//ARGS - Any argument you would like to access in the authenticated user's object.
//This token expires in one day
export const jwtSignInUser = (user: IUser): string => {
  const ONE_DAY = 60 * 60 * 24;
  const { id, username, email, photoUrl } = user;
  const userData = { id, username, email, photoUrl };
  return jwt.sign(userData, `${process.env.JWT_SECRET}`, {
    expiresIn: ONE_DAY,
  });
};
