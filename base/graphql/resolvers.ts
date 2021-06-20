import { withFilter } from "apollo-server-express";
import { GraphQLUpload } from "graphql-upload";

import {
  addContact,
  deleteContact,
  getContactsWithLastMessage,
} from "../Contact";
import { register, login, getUsers, getUser, uploadPhoto } from "../User";
import {
  sendMessage,
  getMessages,
  reactToMessage,
  sendAudioMessage,
} from "../Message";

import {
  IRegArgs,
  IMessageArgs,
  IAudioMessageArgs,
  IReactionArgs,
  IContactArgs,
  ExpressContext,
  IParent,
} from "../Interfaces";
const { User, Message } = require("../models");

export default {
  FileUpload: GraphQLUpload,
  Message: { createdAt: (parent: IParent) => parent.createdAt.toISOString() },
  User: { createdAt: (parent: IParent) => parent.createdAt.toISOString() },
  Contact: { createdAt: (parent: IParent) => parent.createdAt.toISOString() },

  Reaction: {
    createdAt: (parent: IParent) => parent.createdAt.toISOString(),
    message: async (parent: IParent) =>
      await Message.findByPk(parent.messageId),
    user: async (parent: IParent) =>
      await User.findByPk(parent.userId, {
        attributes: ["username", "createdAt", "photoUrl"],
      }),
  },

  Query: {
    getUsers: (_: void, __: void, { user }: ExpressContext) => getUsers(user),

    getUser: (_: void, __: void, { user }: ExpressContext) => getUser(user),

    getUserContacts: (_: void, __: void, { user }: ExpressContext) =>
      getContactsWithLastMessage(user),

    getMessages: (
      _: void,
      { from }: { from: string },
      { user }: ExpressContext
    ) => getMessages(from, user),

    loginUser: (_: any, args: IRegArgs) => login(args),
  },

  Mutation: {
    registerUser: (_: void, args: IRegArgs) => register(args),

    sendMessage: (
      _: void,
      args: IMessageArgs,
      { user, pubsub }: ExpressContext
    ) => sendMessage(args, { user, pubsub }),

    sendAudioMessage: async (
      _: void,
      args: IAudioMessageArgs,
      { user, pubsub }: ExpressContext
    ) => sendAudioMessage(args, { user, pubsub }),

    reactToMessage: (
      _: void,
      args: IReactionArgs,
      { user, pubsub }: ExpressContext
    ) => reactToMessage(args, { user, pubsub }),

    addContact: (
      _: void,
      { contactRecipient }: IContactArgs,
      { user }: ExpressContext
    ) => addContact(contactRecipient, user),

    deleteContact: (
      _: void,
      { contactRecipient }: IContactArgs,
      { user }: ExpressContext
    ) => deleteContact(contactRecipient, user),

    addProfilePhoto: async (
      _: void,
      { file }: { file: File },
      { user }: ExpressContext
    ) => uploadPhoto(file, user),
  },

  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_: void, __: void, { pubsub }) => {
          return pubsub.asyncIterator("NEW_MESSAGE");
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },

    newReaction: {
      subscribe: withFilter(
        (_: void, __: void, { pubsub }) => {
          return pubsub.asyncIterator("NEW_REACTION");
        },
        async ({ newReaction }, _, { user }) => {
          const message = await newReaction.getMessage();
          if (message.from === user.username || message.to === user.username) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
