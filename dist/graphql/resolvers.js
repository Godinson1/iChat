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
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_upload_1 = require("graphql-upload");
const Contact_1 = require("../Contact");
const User_1 = require("../User");
const Message_1 = require("../Message");
const { User, Message } = require("../models");
exports.default = {
    FileUpload: graphql_upload_1.GraphQLUpload,
    Message: { createdAt: (parent) => parent.createdAt.toISOString() },
    User: { createdAt: (parent) => parent.createdAt.toISOString() },
    Contact: { createdAt: (parent) => parent.createdAt.toISOString() },
    Reaction: {
        createdAt: (parent) => parent.createdAt.toISOString(),
        message: (parent) => __awaiter(void 0, void 0, void 0, function* () { return yield Message.findByPk(parent.messageId); }),
        user: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield User.findByPk(parent.userId, {
                attributes: ["username", "createdAt", "photoUrl"],
            });
        }),
    },
    Query: {
        getUsers: (_, __, { user }) => User_1.getUsers(user),
        getUser: (_, __, { user }) => User_1.getUser(user),
        getUserContacts: (_, __, { user }) => Contact_1.getContactsWithLastMessage(user),
        getMessages: (_, { from }, { user }) => Message_1.getMessages(from, user),
        loginUser: (_, args) => User_1.login(args),
    },
    Mutation: {
        registerUser: (_, args) => User_1.register(args),
        sendMessage: (_, args, { user, pubsub }) => Message_1.sendMessage(args, { user, pubsub }),
        sendAudioMessage: (_, args, { user, pubsub }) => __awaiter(void 0, void 0, void 0, function* () { return Message_1.sendAudioMessage(args, { user, pubsub }); }),
        reactToMessage: (_, args, { user, pubsub }) => Message_1.reactToMessage(args, { user, pubsub }),
        addContact: (_, { contactRecipient }, { user }) => Contact_1.addContact(contactRecipient, user),
        deleteContact: (_, { contactRecipient }, { user }) => Contact_1.deleteContact(contactRecipient, user),
        addProfilePhoto: (_, { file }, { user }) => __awaiter(void 0, void 0, void 0, function* () { return User_1.uploadPhoto(file, user); }),
    },
    Subscription: {
        newMessage: {
            subscribe: apollo_server_express_1.withFilter((_, __, { pubsub }) => {
                return pubsub.asyncIterator("NEW_MESSAGE");
            }, ({ newMessage }, _, { user }) => {
                if (newMessage.from === user.username ||
                    newMessage.to === user.username) {
                    return true;
                }
                return false;
            }),
        },
        newReaction: {
            subscribe: apollo_server_express_1.withFilter((_, __, { pubsub }) => {
                return pubsub.asyncIterator("NEW_REACTION");
            }, ({ newReaction }, _, { user }) => __awaiter(void 0, void 0, void 0, function* () {
                const message = yield newReaction.getMessage();
                if (message.from === user.username || message.to === user.username) {
                    return true;
                }
                return false;
            })),
        },
    },
};
