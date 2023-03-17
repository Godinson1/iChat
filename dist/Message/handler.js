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
exports.sendAudioMessage = exports.reactToMessage = exports.getMessages = exports.sendMessage = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const constants_1 = require("./constants");
const utililties_1 = require("../utililties");
const helpers_1 = require("./helpers");
const { Message, User, Reaction, Contact } = models_1.db;
//Send message
const sendMessage = (args, { user, pubsub }) => __awaiter(void 0, void 0, void 0, function* () {
    utililties_1.verifyUser(user);
    const { to, content } = args;
    if (!to || !content || content.trim() === "" || to.trim() === "")
        throw new apollo_server_errors_1.UserInputError("Please fill all required fields..");
    try {
        const recipient = yield User.findOne({ where: { username: to } });
        if (!recipient)
            throw new apollo_server_errors_1.UserInputError("User not found!");
        if (recipient.username === user.username)
            throw new apollo_server_errors_1.UserInputError("Yo! You can't message yourself.");
        const newMessage = { from: user.username, to, content };
        const data = yield Message.create(newMessage);
        pubsub.publish("NEW_MESSAGE", { newMessage: data });
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.sendMessage = sendMessage;
const getMessages = (from, user) => __awaiter(void 0, void 0, void 0, function* () {
    utililties_1.verifyUser(user);
    if (!from || from.trim() === "")
        throw new apollo_server_errors_1.UserInputError("Please fill all required fields..");
    if (from === user.username)
        throw new apollo_server_errors_1.UserInputError("Yo! You can't retrieve just your messages..");
    try {
        const otherChatUser = yield User.findOne({ where: { username: from } });
        if (!otherChatUser)
            throw new apollo_server_errors_1.UserInputError("User not found!");
        //Get current chat username (sender and recipients usernames)
        //Find all messages that matches the username and order in descending format
        const chatUsernames = [user.username, otherChatUser.username];
        const messages = yield Message.findAll({
            where: {
                from: { [sequelize_1.Op.in]: chatUsernames },
                to: { [sequelize_1.Op.in]: chatUsernames },
            },
            order: [["createdAt", "DESC"]],
            include: [{ model: Reaction, as: "reactions" }],
        });
        return messages;
    }
    catch (error) {
        throw error;
    }
});
exports.getMessages = getMessages;
//React to message
const reactToMessage = (args, { user, pubsub }) => __awaiter(void 0, void 0, void 0, function* () {
    utililties_1.verifyUser(user);
    const { messageId, content } = args;
    if (!messageId || !content || content.trim() === "" || messageId.trim() === "")
        throw new apollo_server_errors_1.UserInputError("Please fill all required fields..");
    try {
        if (!constants_1.REACTIONS.includes(content))
            throw new apollo_server_errors_1.UserInputError("Invalid reaction provided!");
        const message = yield Message.findOne({ where: { messageId } });
        if (!message)
            throw new apollo_server_errors_1.UserInputError("Message not found!");
        if (message.to !== user.username && message.from !== user.username)
            throw new apollo_server_errors_1.ForbiddenError("You can't react to some other message you ain't involved in!");
        let reaction = yield Reaction.findOne({ where: { messageId: message.id, userId: user.id } });
        if (reaction) {
            reaction.content = content;
            yield reaction.save();
        }
        else {
            const newReaction = { content, messageId: message.id, userId: user.id };
            reaction = yield Reaction.create(newReaction);
        }
        pubsub.publish("NEW_REACTION", { newReaction: reaction });
        return reaction;
    }
    catch (error) {
        throw error;
    }
});
exports.reactToMessage = reactToMessage;
//Register user
const sendAudioMessage = (args, { user, pubsub }) => __awaiter(void 0, void 0, void 0, function* () {
    utililties_1.verifyUser(user);
    const { to, file } = args;
    const { filename, createReadStream } = yield file;
    if (!to || to.trim() === "")
        throw new apollo_server_errors_1.UserInputError("Please fill all required fields..");
    try {
        const otherUser = yield User.findOne({ where: { username: to } });
        if (!otherUser)
            throw new apollo_server_errors_1.UserInputError("User not found!");
        if (user.username === otherUser.username)
            throw new apollo_server_errors_1.ForbiddenError("You can't message yourself! 😆");
        let contact = yield Contact.findOne({ where: { contactRecipient: otherUser.username, userId: user.id } });
        if (!contact)
            throw new apollo_server_errors_1.UserInputError("Contact not found!");
        const stream = createReadStream();
        const type = "audio";
        const url = yield helpers_1.uploadImageCloudinary(stream, filename, type);
        const newMessage = { from: user.username, to, content: url };
        const data = yield Message.create(newMessage);
        pubsub.publish("NEW_MESSAGE", { newMessage: data });
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.sendAudioMessage = sendAudioMessage;
