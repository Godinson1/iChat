import { UserInputError, ForbiddenError } from "apollo-server-errors";
import { Op } from "sequelize";
import { db } from "../models";
import { IContact, IMessage } from "../Interfaces";
import { IDecodedToken } from "../Interfaces";
import { verifyUser } from "../utililties";

const { Contact, User, Message } = db;

//Add new contact
const addContact = async (contactRecipient: string, user: IDecodedToken) => {
  verifyUser(user);

  if (!contactRecipient || contactRecipient.trim() === "") throw new UserInputError("Please fill all required fields..");

  try {
    const otherUser = await User.findOne({ where: { username: contactRecipient } });
    if (!otherUser) throw new UserInputError("User not found!");
    if (user.username === otherUser.username) throw new ForbiddenError("You can't add yourself!");

    let contact = await Contact.findOne({
      where: { contactRecipient: otherUser.username, userId: user.id },
    });
    if (contact) throw new UserInputError("Contact already added!");

    //Create new Contact
    const newContact = {
      contactRecipient,
      contactInitiator: user.username,
      contactInitiatorPhotoUrl: user.photoUrl || "some-url",
      contactRecipientPhotoUrl: otherUser.photoUrl || "some-url",
      userId: user.id,
    };
    const data = await Contact.create(newContact);
    return data;
  } catch (error) {
    throw error;
  }
};

//Get Authenticated users details excluding authenticated user
const getContactsWithLastMessage = async (user: IDecodedToken) => {
  try {
    verifyUser(user);
    if (user) {
      let contacts = await Contact.findAll({ where: { contactInitiator: user.username }, order: [["createdAt", "DESC"]] });

      const messages = await Message.findAll({
        where: { [Op.or]: [{ from: user.username }, { to: user.username }] },
        order: [["createdAt", "DESC"]],
      });

      //Map through each contact and find authenticated last message to each.
      contacts = contacts.map((otherContact: IContact) => {
        const lastMessage = messages.find(
          (message: IMessage) => message.from === otherContact.contactRecipient || message.to === otherContact.contactRecipient
        );
        otherContact.lastMessage = lastMessage;
        return otherContact;
      });

      return contacts;
    }
  } catch (error) {
    throw error;
  }
};

//Remove contact
const deleteContact = async (contactRecipient: string, user: IDecodedToken) => {
  verifyUser(user);
  if (!contactRecipient || contactRecipient.trim() === "") throw new UserInputError("Please fill all required fields..");

  try {
    const otherUser = await User.findOne({ where: { username: contactRecipient } });
    if (!otherUser) throw new UserInputError("User not found!");
    if (user.username === otherUser.username) throw new ForbiddenError("You can't delete your account! 😆");

    let contact = await Contact.findOne({ where: { contactRecipient: otherUser.username, userId: user.id } });
    if (!contact) throw new UserInputError("Contact not found!");

    await Contact.destroy({ where: { contactRecipient, userId: user.id } });
    return { status: "sucess", message: `@${contactRecipient} deleted successfully!`, contactRecipient };
  } catch (error) {
    throw error;
  }
};

export { addContact, getContactsWithLastMessage, deleteContact };
