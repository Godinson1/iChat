import CurrentChat from "./CurrentChat";
import Chat from "./main/Chat";
import MainChat from "./main/MainChat";
import {
  ChatLanding,
  ChatMessages,
  ChatFooter,
  ChatHeader,
  Messages,
} from "./main";
import {
  GET_MESSAGES,
  GET_USERS,
  GET_USER,
  SEND_MESSAGE,
  RECEIVE_MESSAGES,
  SEND_AUDIO_MESSAGE,
} from "./schema";
import {
  IUser,
  IMessage,
  ICurrentChat,
  IChatMessages,
  IChatAudio,
  IChatHeaderFooter,
} from "./interface";

export {
  CurrentChat,
  Chat,
  ChatLanding,
  ChatMessages,
  ChatFooter,
  ChatHeader,
  Messages,
  MainChat,
  GET_MESSAGES,
  GET_USERS,
  GET_USER,
  SEND_MESSAGE,
  RECEIVE_MESSAGES,
  SEND_AUDIO_MESSAGE,
};
export type {
  IUser,
  IMessage,
  ICurrentChat,
  IChatMessages,
  IChatAudio,
  IChatHeaderFooter,
};
