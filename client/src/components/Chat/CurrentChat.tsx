import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";

import { setAllContacts, setSelectedContact } from "../../redux";
import { GET_USER_CONTACTS } from "../Contact/schema";
import { IContact } from "../Contact/interface";
import Layout, { Header, LoaderChat } from "../Layout";
import { useViewport } from "../../utils";

const CurrentChat = () => {
  const [contactsData, setContactsData] = useState<Array<IContact>>([]);
  const [filteredData, setFilteredData] =
    useState<Array<IContact>>(contactsData);
  const [search, setSearch] = useState("");
  const contacts = useSelector((state: RootStateOrAny) => state.contact);

  const history = useHistory();
  const { width } = useViewport();
  const dispatch = useDispatch();

  //Get authenticated user contacts
  const { data, loading } = useQuery(GET_USER_CONTACTS);

  //Find current selected contact
  const selectedContact = contacts.contacts?.find(
    (contact: IContact) => contact.selected === true
  );

  //Sort data by username
  useEffect(() => {
    if (contacts && contacts.contacts) {
      const filterData = contacts.contacts.filter((contact: IContact) =>
        contact.contactRecipient.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filterData);
      setContactsData(filterData);
    }
  }, [contacts, search]);

  //Dispatch user's contact data to state..
  useEffect(() => {
    if (data) {
      dispatch(setAllContacts(data.getUserContacts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //Set contacts data to state locally
  useEffect(() => {
    if (contacts && contacts.contacts) {
      setContactsData(contacts.contacts);
    }
  }, [contacts, contacts.contacts]);

  //Set contacts data to filtered data
  useEffect(() => {
    setFilteredData(contactsData);
  }, [contactsData]);

  return (
    <div>
      <Layout>
        <Header setSearch={setSearch} search={search} />
        <div className="active-chats-body">
          {loading ? (
            <div className="no-data">
              <LoaderChat />
            </div>
          ) : filteredData && filteredData.length === 0 ? (
            <div className="no-data">No Result Found! Add a Contact.</div>
          ) : (
            filteredData &&
            filteredData
              .filter((message) => message.lastMessage !== null)
              .map(
                ({
                  contactRecipient,
                  contactRecipientPhotoUrl,
                  lastMessage,
                }: IContact) => (
                  <div
                    className={`active-chat ${
                      selectedContact &&
                      selectedContact.contactRecipient === contactRecipient
                        ? "selected"
                        : ""
                    }`}
                    key={contactRecipient}
                    onClick={() => {
                      dispatch(setSelectedContact(contactRecipient));
                      width > 768 ? (
                        <div></div>
                      ) : (
                        history.push(`/${contactRecipient}`)
                      );
                    }}
                  >
                    <div className="left">
                      <div className="user-avatar">
                        <img
                          src={
                            contactRecipientPhotoUrl?.slice(-1) === "g"
                              ? contactRecipientPhotoUrl
                              : "/images/chat.png"
                          }
                          alt="user"
                        />
                      </div>
                      <div className="chat-name-container">
                        <div id="title">{contactRecipient}</div>
                        <div id="desc">
                          {lastMessage?.content.slice(-4) === ".wav"
                            ? "voice message"
                            : lastMessage?.content}
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      <div id="desc">
                        {dayjs(lastMessage?.createdAt).format("h:mm A")}
                      </div>
                    </div>
                  </div>
                )
              )
          )}
        </div>
      </Layout>
    </div>
  );
};

export default CurrentChat;
