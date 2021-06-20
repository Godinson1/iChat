import { UserInputError, ForbiddenError } from "apollo-server-errors";
import { Op } from "sequelize";
import { db } from "../models";
import { IContact, IMessage } from "../Interfaces";
import { IDecodedToken } from "../Interfaces";
import { verifyUser } from "../utililties";

const { Contact, User, Message } = db;

//Add new contact
const addContact = async (contactRecipient: string, user: IDecodedToken) => {
  //Verify authenticated user
  verifyUser(user);

  //Do a proper validation - check for empty arguments
  if (!contactRecipient || contactRecipient.trim() === "")
    throw new UserInputError("Please fill all required fields..");

  try {
    //Check if username exist, if not throw error.
    const otherUser = await User.findOne({
      where: { username: contactRecipient },
    });

    if (!otherUser) throw new UserInputError("User not found!");

    //Check if otherUsername equals authenticated username
    if (user.username === otherUser.username)
      throw new ForbiddenError("You can't add yourself!");

    //Check if contact already exist
    //If yes, throw error else create new contact
    let contact = await Contact.findOne({
      where: {
        contactRecipient: otherUser.username,
        userId: user.id,
      },
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

    //Return created contact
    return data;
  } catch (error) {
    //Throw any caught error
    throw error;
  }
};

//Get Authenticated users details excluding authenticated user
const getContactsWithLastMessage = async (user: IDecodedToken) => {
  try {
    verifyUser(user);
    if (user) {
      //Find all contacts of the authenticated user
      let contacts = await Contact.findAll({
        where: {
          contactInitiator: user.username,
        },
        order: [["createdAt", "DESC"]],
      });

      //Find all messages for the current user
      const messages = await Message.findAll({
        where: {
          [Op.or]: [{ from: user.username }, { to: user.username }],
        },
        order: [["createdAt", "DESC"]],
      });

      //Map through each contact and find authenticated last message to each.
      contacts = contacts.map((otherContact: IContact) => {
        const lastMessage = messages.find(
          (message: IMessage) =>
            message.from === otherContact.contactRecipient ||
            message.to === otherContact.contactRecipient
        );
        otherContact.lastMessage = lastMessage;
        return otherContact;
      });

      //Return contacts data with last messages
      return contacts;
    }
  } catch (error) {
    //Throw any caught error
    throw error;
  }
};

//Remove contact
const deleteContact = async (contactRecipient: string, user: IDecodedToken) => {
  //Verify authenticated user
  verifyUser(user);

  //Do a proper validation - check for empty arguments
  if (!contactRecipient || contactRecipient.trim() === "")
    throw new UserInputError("Please fill all required fields..");

  try {
    //Check if username exist, if not throw error.
    const otherUser = await User.findOne({
      where: { username: contactRecipient },
    });

    if (!otherUser) throw new UserInputError("User not found!");

    //Check if otherUsername equals authenticated username
    if (user.username === otherUser.username)
      throw new ForbiddenError("You can't delete your account! 😆");

    //Check if contact exist
    //If yes, delete contact
    let contact = await Contact.findOne({
      where: {
        contactRecipient: otherUser.username,
        userId: user.id,
      },
    });
    if (!contact) throw new UserInputError("Contact not found!");

    await Contact.destroy({
      where: {
        contactRecipient,
        userId: user.id,
      },
    });

    //Return deleted response
    return {
      status: "sucess",
      message: `@${contactRecipient} deleted successfully!`,
      contactRecipient,
    };
  } catch (error) {
    //Throw any caught error
    throw error;
  }
};

export { addContact, getContactsWithLastMessage, deleteContact };
