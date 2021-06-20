import React from "react";
import { CurrentChat, Chat } from "../Chat";
import "./auth.scss";

const Landing = () => {
  return (
    <div>
      <div className="main">
        <div className="active-chats">
          <CurrentChat />
        </div>
        <div className="chat">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Landing;
