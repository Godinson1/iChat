import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { useQuery } from "@apollo/client";

import {
  AddContact,
  GET_USER_CONTACTS,
  IContact,
  Contact,
  LoaderChat,
} from "./index";
import { setContactModal, setAllContacts } from "../../redux";

import "./contact.scss";

const AllContacts = () => {
  const contacts = useSelector((state: RootStateOrAny) => state.contact);
  const [activeTab, setActiveTab] = useState(1);

  const dispatch = useDispatch();

  const { data, loading } = useQuery(GET_USER_CONTACTS);

  useEffect(() => {
    if (data) {
      dispatch(setAllContacts(data.getUserContacts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="contacts">
      <div onClick={() => dispatch(setContactModal(false))} className="close">
        x
      </div>
      <div className="contact-header">
        <div
          onClick={() => setActiveTab(1)}
          className={activeTab === 1 ? "active" : ""}
        >
          <h3>ALL CONTACTS</h3>
        </div>
        <div
          onClick={() => setActiveTab(2)}
          className={activeTab === 2 ? "active" : ""}
        >
          <h3>ADD CONTACT</h3>
        </div>
      </div>
      {activeTab === 2 ? (
        <AddContact />
      ) : (
        <div>
          {loading ? (
            <div className="no-data">
              <LoaderChat />
            </div>
          ) : contacts && contacts.contacts === [] ? (
            "No contact found.."
          ) : (
            contacts.contacts.map((data: IContact) => (
              <Contact key={data.contactRecipient} data={data} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllContacts;
