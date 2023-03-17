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
exports.deleteContact = exports.getContactsWithLastMessage = exports.addContact = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const utililties_1 = require("../utililties");
const { Contact, User, Message } = models_1.db;
//Add new contact
const addContact = (contactRecipient, user) => __awaiter(void 0, void 0, void 0, function* () {
    utililties_1.verifyUser(user);
    if (!contactRecipient || contactRecipient.trim() === "")
        throw new apollo_server_errors_1.UserInputError("Please fill all required fields..");
    try {
        const otherUser = yield User.findOne({ where: { username: contactRecipient } });
        if (!otherUser)
            throw new apollo_server_errors_1.UserInputError("User not found!");
        if (user.username === otherUser.username)
            throw new apollo_server_errors_1.ForbiddenError("You can't add yourself!");
        let contact = yield Contact.findOne({
            where: { contactRecipient: otherUser.username, userId: user.id },
        });
        if (contact)
            throw new apollo_server_errors_1.UserInputError("Contact already added!");
        //Create new Contact
        const newContact = {
            contactRecipient,
            contactInitiator: user.username,
            contactInitiatorPhotoUrl: user.photoUrl || "some-url",
            contactRecipientPhotoUrl: otherUser.photoUrl || "some-url",
            userId: user.id,
        };
        const data = yield Contact.create(newContact);
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.addContact = addContact;
//Get Authenticated users details excluding authenticated user
const getContactsWithLastMessage = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utililties_1.verifyUser(user);
        if (user) {
            let contacts = yield Contact.findAll({ where: { contactInitiator: user.username }, order: [["createdAt", "DESC"]] });
            const messages = yield Message.findAll({
                where: { [sequelize_1.Op.or]: [{ from: user.username }, { to: user.username }] },
                order: [["createdAt", "DESC"]],
            });
            //Map through each contact and find authenticated last message to each.
            contacts = contacts.map((otherContact) => {
                const lastMessage = messages.find((message) => message.from === otherContact.contactRecipient || message.to === otherContact.contactRecipient);
                otherContact.lastMessage = lastMessage;
                return otherContact;
            });
            return contacts;
        }
    }
    catch (error) {
        throw error;
    }
});
exports.getContactsWithLastMessage = getContactsWithLastMessage;
//Remove contact
const deleteContact = (contactRecipient, user) => __awaiter(void 0, void 0, void 0, function* () {
    utililties_1.verifyUser(user);
    if (!contactRecipient || contactRecipient.trim() === "")
        throw new apollo_server_errors_1.UserInputError("Please fill all required fields..");
    try {
        const otherUser = yield User.findOne({ where: { username: contactRecipient } });
        if (!otherUser)
            throw new apollo_server_errors_1.UserInputError("User not found!");
        if (user.username === otherUser.username)
            throw new apollo_server_errors_1.ForbiddenError("You can't delete your account! 😆");
        let contact = yield Contact.findOne({ where: { contactRecipient: otherUser.username, userId: user.id } });
        if (!contact)
            throw new apollo_server_errors_1.UserInputError("Contact not found!");
        yield Contact.destroy({ where: { contactRecipient, userId: user.id } });
        return { status: "sucess", message: `@${contactRecipient} deleted successfully!`, contactRecipient };
    }
    catch (error) {
        throw error;
    }
});
exports.deleteContact = deleteContact;
