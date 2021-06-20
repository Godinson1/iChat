import { Request } from "express";
import { PubSub } from "apollo-server-express";
import { IDecodedToken } from "./index";

export interface ExpressContext {
  req?: Request;
  user: IDecodedToken;
  pubsub: PubSub;
  connection?: {
    context: {
      Authorization: string;
    };
  };
}

export interface IParent {
  createdAt: {
    toISOString: Function;
  };
  messageId: number;
  userId: number;
}
