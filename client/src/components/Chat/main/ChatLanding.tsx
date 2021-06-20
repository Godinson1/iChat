import React from "react";
import "./main_chat.scss";

const ChatLanding = () => {
  return (
    <div className="chat-landing">
      <div className="logo">
        <img src={"/images/chat.png"} alt="ichat-logo" />
      </div>
      <div>
        <h1>iChat</h1>
      </div>
      <div id="line"></div>
      <div className="chat-landing-dec">
        Current chat will be shown here. Select a user to begin chat!
      </div>
    </div>
  );
};

export default ChatLanding;
