import React from "react";

import { IMessage, Messages, IChatMessages } from "../index";
import { LoaderChat } from "../../Layout";
import "./main_chat.scss";

const ChatMessages = ({
  activeContactMessages,
  loading,
  selectedContact,
}: IChatMessages) => {
  let chatStructure;

  if (!activeContactMessages && !loading) {
    chatStructure = <p>Select a contact to begin chat!</p>;
  } else if (loading) {
    chatStructure = (
      <div className="no-data">
        <LoaderChat />
      </div>
    );
  } else if (activeContactMessages.length > 0) {
    chatStructure = activeContactMessages.map(
      (message: IMessage, index: number) => (
        <Messages key={index} message={message} />
      )
    );
  } else if (activeContactMessages.length === 0) {
    chatStructure = (
      <p style={{ textAlign: "center" }}>
        You are now connected with <b>@{selectedContact.contactRecipient}</b>
        <br />
        <span className="base-desc">
          Send a message to begin the iChat experience.
        </span>
      </p>
    );
  }

  return (
    <div className="message-container">
      <div className="container">{chatStructure}</div>
    </div>
  );
};

export default ChatMessages;
