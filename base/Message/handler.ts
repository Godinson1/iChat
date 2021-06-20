import { UserInputError, ForbiddenError } from "apollo-server-errors";
import { Op } from "sequelize";

import { db } from "../models";

import {
  IDecodedToken,
  ExpressContext,
  IMessageArgs,
  IReactionArgs,
  IAudioMessageArgs,
} from "../Interfaces";
import { REACTIONS } from "./constants";
import { verifyUser } from "../utililties";
import { uploadMedia } from "./helpers";

const { Message, User, Reaction, Contact } = db;

//Send message
const sendMessage = async (
  args: IMessageArgs,
  { user, pubsub }: ExpressContext
) => {
  //Verify authenticated user
  verifyUser(user);

  //Destructure arguments
  const { to, content } = args;

  //Do a proper validation - check for empty arguments
  if (!to || !content || content.trim() === "" || to.trim() === "")
    throw new UserInputError("Please fill all required fields..");

  try {
    //Check if recipient exist
    //if not throw error
    const recipient = await User.findOne({
      where: { username: to },
    });
    if (!recipient) throw new UserInputError("User not found!");

    //Check if recipient is same with authenticated user
    //If true, throw error as recipient shouldn't message themselves.
    if (recipient.username === user.username)
      throw new UserInputError("Yo! You can't message yourself.");

    //Create new Message
    const newMessage = {
      from: user.username,
      to,
      content,
    };
    const data = await Message.create(newMessage);

    //publish new message with event or trigger name "NEW_MESSAGE" and pass
    //newly created data
    pubsub.publish("NEW_MESSAGE", { newMessage: data });

    //Return created message
    return data;
  } catch (error) {
    throw error;
  }
};

const getMessages = async (from: string, user: IDecodedToken) => {
  //Verify authenticated user
  verifyUser(user);

  //Do a proper validation
  if (!from || from.trim() === "")
    throw new UserInputError("Please fill all required fields..");

  //Check if user if trying to retrieve just their personal messages..
  if (from === user.username)
    throw new UserInputError("Yo! You can't retrieve just your messages..");

  try {
    //Check if user exist, if not throw error
    const otherChatUser = await User.findOne({
      where: { username: from },
    });
    if (!otherChatUser) throw new UserInputError("User not found!");

    //Get current chat username (sender and recipients usernames)
    //Find all messages that matches the username and order in descending format
    const chatUsernames = [user.username, otherChatUser.username];
    const messages = await Message.findAll({
      where: {
        from: { [Op.in]: chatUsernames },
        to: { [Op.in]: chatUsernames },
      },
      order: [["createdAt", "DESC"]],
      include: [{ model: Reaction, as: "reactions" }],
    });

    //Return all messages matching the current authenticated user and [from] parameter
    return messages;
  } catch (error) {
    //throw any error caught while resolving request..
    throw error;
  }
};

//React to message
const reactToMessage = async (
  args: IReactionArgs,
  { user, pubsub }: ExpressContext
) => {
  //Verify authenticated user
  verifyUser(user);

  //Destructure arguments
  const { messageId, content } = args;

  //Do a proper validation - check for empty arguments
  if (
    !messageId ||
    !content ||
    content.trim() === "" ||
    messageId.trim() === ""
  )
    throw new UserInputError("Please fill all required fields..");

  try {
    //Check if reaction is valid, if not throw error.
    if (!REACTIONS.includes(content))
      throw new UserInputError("Invalid reaction provided!");

    //Check if message exist, if not throw error.
    const message = await Message.findOne({
      where: { messageId },
    });
    if (!message) throw new UserInputError("Message not found!");

    //Check if message belongs to either authenticated user or current chatting user
    if (message.to !== user.username && message.from !== user.username)
      throw new ForbiddenError(
        "You can't react to some other message you ain't involved in!"
      );

    //Check if reaction already exist
    //If yes, update it else create new reaction to message
    let reaction = await Reaction.findOne({
      where: {
        messageId: message.id,
        userId: user.id,
      },
    });

    if (reaction) {
      //Update existing Reaction
      reaction.content = content;
      await reaction.save();
    } else {
      //Create new Reaction
      const newReaction = {
        content,
        messageId: message.id,
        userId: user.id,
      };
      reaction = await Reaction.create(newReaction);
    }

    //publish new reaction with event or trigger name "NEW_REACTION" and pass data.
    pubsub.publish("NEW_REACTION", { newReaction: reaction });

    //Return created reaction
    return reaction;
  } catch (error) {
    //Throw any caught error
    throw error;
  }
};

//Register user
const sendAudioMessage = async (
  args: IAudioMessageArgs,
  { user, pubsub }: ExpressContext
) => {
  //Verify authenticated user
  verifyUser(user);

  //Destructure arguments
  const { to, file } = args;
  const { filename, createReadStream } = await file;

  //Do a proper validation - check for empty arguments
  if (!to || to.trim() === "")
    throw new UserInputError("Please fill all required fields..");

  try {
    //Check if username exist, if not throw error.
    const otherUser = await User.findOne({
      where: { username: to },
    });

    if (!otherUser) throw new UserInputError("User not found!");

    //Check if otherUsername equals authenticated username
    if (user.username === otherUser.username)
      throw new ForbiddenError("You can't message yourself! 😆");

    //Check if contact exist
    //If yes, send message
    let contact = await Contact.findOne({
      where: {
        contactRecipient: otherUser.username,
        userId: user.id,
      },
    });
    if (!contact) throw new UserInputError("Contact not found!");

    const stream = createReadStream();
    const type = "audio";
    const url = await uploadMedia(stream, filename, type);

    //Create new Message
    const newMessage = {
      from: user.username,
      to,
      content: url,
    };
    const data = await Message.create(newMessage);

    //publish new message with event or trigger name "NEW_MESSAGE" and pass
    //newly created data
    pubsub.publish("NEW_MESSAGE", { newMessage: data });

    //Return created message
    return data;
  } catch (error) {
    throw error;
  }
};

export { sendMessage, getMessages, reactToMessage, sendAudioMessage };
