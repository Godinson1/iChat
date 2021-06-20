import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ADD_CONTACTS } from "./schema";
import { useMutation } from "@apollo/client";
import { Button, Input } from "../../utils";
import {
  setSuccessMessage,
  setErrorMessage,
  addContact as setContact,
} from "../../redux";

const AddContact = () => {
  const [contactRecipient, setContactRecipient] = useState("");
  const dispatch = useDispatch();
  const [addContact, { loading }] = useMutation(ADD_CONTACTS, {
    onCompleted: (data) => {
      setContactRecipient("");
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addContact({ variables: { contactRecipient } });
  };

  return (
    <div className="add-contact">
      <div>
        <div>iChat Username</div>
        <form onSubmit={handleSubmit}>
          <Input
            error={""}
            value={contactRecipient}
            name="username"
            required
            onChange={(e) => setContactRecipient(e.target.value)}
            label=""
          />
          <Button disabled={loading} label={loading ? "Loading.." : "Add"} />
        </form>
      </div>
    </div>
  );
};

export default AddContact;
