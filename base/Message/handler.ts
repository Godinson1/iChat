import { UserInputError, ForbiddenError } from "apollo-server-errors";
import { Op } from "sequelize";

import { db } from "../models";

import { IDecodedToken, ExpressContext, IMessageArgs, IReactionArgs, IAudioMessageArgs } from "../Interfaces";
import { REACTIONS } from "./constants";
import { verifyUser } from "../utililties";
import { uploadImageCloudinary } from "./helpers";

const { Message, User, Reaction, Contact } = db;

//Send message
const sendMessage = async (args: IMessageArgs, { user, pubsub }: ExpressContext) => {
  verifyUser(user);
  const { to, content } = args;

  if (!to || !content || content.trim() === "" || to.trim() === "") throw new UserInputError("Please fill all required fields..");

  try {
    const recipient = await User.findOne({ where: { username: to } });
    if (!recipient) throw new UserInputError("User not found!");
    if (recipient.username === user.username) throw new UserInputError("Yo! You can't message yourself.");

    const newMessage = { from: user.username, to, content };
    const data = await Message.create(newMessage);
    pubsub.publish("NEW_MESSAGE", { newMessage: data });
    return data;
  } catch (error) {
    throw error;
  }
};

const getMessages = async (from: string, user: IDecodedToken) => {
  verifyUser(user);
  if (!from || from.trim() === "") throw new UserInputError("Please fill all required fields..");
  if (from === user.username) throw new UserInputError("Yo! You can't retrieve just your messages..");

  try {
    const otherChatUser = await User.findOne({ where: { username: from } });
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
    return messages;
  } catch (error) {
    throw error;
  }
};

//React to message
const reactToMessage = async (args: IReactionArgs, { user, pubsub }: ExpressContext) => {
  verifyUser(user);
  const { messageId, content } = args;

  if (!messageId || !content || content.trim() === "" || messageId.trim() === "")
    throw new UserInputError("Please fill all required fields..");

  try {
    if (!REACTIONS.includes(content)) throw new UserInputError("Invalid reaction provided!");

    const message = await Message.findOne({ where: { messageId } });
    if (!message) throw new UserInputError("Message not found!");

    if (message.to !== user.username && message.from !== user.username)
      throw new ForbiddenError("You can't react to some other message you ain't involved in!");

    let reaction = await Reaction.findOne({ where: { messageId: message.id, userId: user.id } });
    if (reaction) {
      reaction.content = content;
      await reaction.save();
    } else {
      const newReaction = { content, messageId: message.id, userId: user.id };
      reaction = await Reaction.create(newReaction);
    }

    pubsub.publish("NEW_REACTION", { newReaction: reaction });
    return reaction;
  } catch (error) {
    throw error;
  }
};

//Register user
const sendAudioMessage = async (args: IAudioMessageArgs, { user, pubsub }: ExpressContext) => {
  verifyUser(user);
  const { to, file } = args;
  const { filename, createReadStream } = await file;
  if (!to || to.trim() === "") throw new UserInputError("Please fill all required fields..");

  try {
    const otherUser = await User.findOne({ where: { username: to } });
    if (!otherUser) throw new UserInputError("User not found!");
    if (user.username === otherUser.username) throw new ForbiddenError("You can't message yourself! 😆");

    let contact = await Contact.findOne({ where: { contactRecipient: otherUser.username, userId: user.id } });
    if (!contact) throw new UserInputError("Contact not found!");

    const stream = createReadStream();
    const type = "audio";
    const url = await uploadImageCloudinary(stream, filename, type);
    const newMessage = { from: user.username, to, content: url };
    const data = await Message.create(newMessage);

    pubsub.publish("NEW_MESSAGE", { newMessage: data });
    return data;
  } catch (error) {
    throw error;
  }
};

export { sendMessage, getMessages, reactToMessage, sendAudioMessage };
