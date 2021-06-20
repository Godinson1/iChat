import React from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";

import relativeTime from "dayjs/plugin/relativeTime";

import {
  setSelectedContact,
  setContactModal,
  setSuccessMessage,
  setErrorMessage,
  removeContact,
} from "../../redux";
import { IContact } from "./interface";
import { useViewport } from "../../utils";
import { DELETE_CONTACT } from "./schema";

const Contact = ({
  data: { contactRecipient, createdAt, contactRecipientPhotoUrl },
}: {
  data: IContact;
}) => {
  //Use useDispatch hook to dispatch action to state
  const dispatch = useDispatch();
  const history = useHistory();
  const { width } = useViewport();

  const [deleteContact, { loading }] = useMutation(DELETE_CONTACT, {
    onCompleted: (data) => {
      dispatch(removeContact(data.deleteContact.contactRecipient));
      dispatch(setSuccessMessage(data.deleteContact.message));
    },
    onError: (error) => {
      dispatch(setErrorMessage(error.message));
    },
  });

  dayjs.extend(relativeTime);

  return (
    <div className={`contact-container`}>
      <div
        className="flex"
        onClick={() => {
          dispatch(setSelectedContact(contactRecipient));
          dispatch(setContactModal(false));
          width > 768 ? <div></div> : history.push(`/${contactRecipient}`);
        }}
      >
        <div className="left">
          <div className="user-avatar">
            <img
              src={
                contactRecipientPhotoUrl.slice(-1) === "g"
                  ? contactRecipientPhotoUrl
                  : "/images/chat.png"
              }
              alt="user"
            />
          </div>
        </div>
        <div className="chat-name-container">
          <div id="title">{contactRecipient}</div>
          <div className="right">
            <div id="desc">Added {dayjs(createdAt).fromNow()}</div>
          </div>
        </div>
      </div>
      <div
        onClick={() => deleteContact({ variables: { contactRecipient } })}
        className="btn-add"
      >
        {loading ? "Deleting..." : "Delete"}
      </div>
    </div>
  );
};

export default Contact;
