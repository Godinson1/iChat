import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useHistory } from "react-router-dom";
import { useViewport } from "../../../utils";
import { IChatHeaderFooter } from "../index";

const ChatHeader = ({ selectedContact }: IChatHeaderFooter) => {
  const { width } = useViewport();
  const history = useHistory();
  dayjs.extend(relativeTime);

  return (
    <div className="main-header">
      <div className="flex">
        {width > 768 ? (
          ""
        ) : (
          <div onClick={() => history.goBack()} className="back-arrow">
            &#8592;
          </div>
        )}
        <div>
          <div id="title">
            {selectedContact && selectedContact.contactRecipient
              ? selectedContact.contactRecipient
              : "Select a user."}
          </div>
          <span id="desc">
            {selectedContact
              ? `Added ${dayjs(selectedContact?.createdAt).fromNow()}`
              : ""}
          </span>
        </div>
      </div>
      <div className="user-avatar header-avatar">
        <img
          src={
            selectedContact && selectedContact.contactRecipientPhotoUrl
              ? selectedContact.contactRecipientPhotoUrl
              : "/images/chat.png"
          }
          alt="user"
        />
      </div>
    </div>
  );
};

export default ChatHeader;
