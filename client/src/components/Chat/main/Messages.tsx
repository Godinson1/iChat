import React from "react";
import { useSelector, RootStateOrAny } from "react-redux";
import dayjs from "dayjs";
import { IMessage } from "../index";

const Messages = ({ message }: { message: IMessage }) => {
  const user = useSelector((state: RootStateOrAny) => state.user.user);
  const sentMessage = message.from === user.username;

  return (
    <div key={message.messageId} className={sentMessage ? "sent" : "received"}>
      <div className="content">
        {message.content.slice(-4) === ".wav" ? (
          <audio controls className="ichat-audio">
            <source src={message.content} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          message.content
        )}
        <div className="message-time">
          {dayjs(message.createdAt).format("h:mm A")}
        </div>
      </div>
    </div>
  );
};

export default Messages;
