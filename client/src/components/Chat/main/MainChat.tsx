import React, { useEffect } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";

import {
  GET_MESSAGES,
  ChatLanding,
  ChatMessages,
  ChatHeader,
  ChatFooter,
} from "../index";
import { setContactMessages } from "../../../redux";

import "./main_chat.scss";
import { IContact } from "../../Contact/interface";

const MainChat = () => {
  const contacts = useSelector((state: RootStateOrAny) => state.contact);
  const dispatch = useDispatch();

  //Set query
  const [getMessages, { data, loading }] = useLazyQuery(GET_MESSAGES);

  //contact selected
  const selectedContact = contacts.contacts?.find(
    (contact: IContact) => contact.selected === true
  );

  //Get active[selected] contact messages.
  const activeContactMessages = selectedContact?.messages;

  //Get messages with selected contact username
  useEffect(() => {
    if (selectedContact && !selectedContact.messages) {
      getMessages({ variables: { from: selectedContact.contactRecipient } });
    }
  }, [getMessages, selectedContact]);

  //dispatch data to store
  useEffect(() => {
    if (data) {
      const messages = data.getMessages;
      dispatch(
        setContactMessages({
          messages,
          username: selectedContact.contactRecipient,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      {!activeContactMessages && !loading ? (
        <ChatLanding />
      ) : (
        <div>
          <div className="chat-main">
            <ChatHeader selectedContact={selectedContact} />
            <ChatMessages
              activeContactMessages={activeContactMessages}
              selectedContact={selectedContact}
              loading={loading}
            />
            <ChatFooter selectedContact={selectedContact} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainChat;
