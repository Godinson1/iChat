import React from "react";
import { useSelector, RootStateOrAny, useDispatch } from "react-redux";

import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { IUser } from "../Chat";
import {
  setSuccessMessage,
  setErrorMessage,
  addContact as setContact,
} from "../../redux";
import { ADD_CONTACTS, IContact } from "../Contact";

const User = ({ data: { photoUrl, username, createdAt } }: { data: IUser }) => {
  const contacts = useSelector((state: RootStateOrAny) => state.contact);

  dayjs.extend(relativeTime);
  const dispatch = useDispatch();

  const [addContact, { loading }] = useMutation(ADD_CONTACTS, {
    onCompleted: (data) => {
      dispatch(setContact(data.addContact));
      dispatch(
        setSuccessMessage(
          `@${data.addContact.contactRecipient} added successfully.`
        )
      );
    },
    onError: (error) => {
      dispatch(setErrorMessage(error.message));
    },
  });

  return (
    <div className="contact-container">
      <div className="flex">
        <div className="left">
          <div className="user-avatar">
            <img src={photoUrl ? photoUrl : "/images/chat.png"} alt="user" />
          </div>
        </div>
        <div className="chat-name-container">
          <div id="title">{username}</div>
          <div className="right">
            <div id="desc">Joined {dayjs(createdAt).fromNow()}</div>
          </div>
        </div>
      </div>
      {contacts.contacts &&
      contacts.contacts.find(
        (contact: IContact) => contact.contactRecipient === username
      ) ? (
        ""
      ) : (
        <div
          onClick={() =>
            addContact({ variables: { contactRecipient: username } })
          }
          className="btn-add"
        >
          {loading ? "loading.." : "Add"}
        </div>
      )}
    </div>
  );
};

export default User;
