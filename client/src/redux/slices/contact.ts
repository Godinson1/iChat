import { createSlice } from "@reduxjs/toolkit";
import { IContact } from "../../components/Contact/interface";

const initialState = {
  contacts: [],
  contact: {},
};

const contact = createSlice({
  name: "contact",
  initialState: initialState,
  reducers: {
    setAllContacts: (state, action) => {
      //Set contact data to state.
      state.contacts = action.payload;
      //Return state
      return state;
    },
    setContact: (state, action) => {
      //Set contact data to state.
      state.contact = action.payload;
      //Return state
      return state;
    },
    setSelectedContact: (state, action) => {
      //Add new field[selected] to state contact object
      const contactsSelected = (state.contacts as unknown as any).map(
        (contact: IContact) => ({
          ...contact,
          selected: contact.contactRecipient === action.payload,
        })
      );
      //Return new state
      return {
        ...state,
        contacts: contactsSelected,
      };
    },
    addContact: (state, action) => {
      //Add new contact to existing contacts data
      let contactsData = [action.payload, ...state.contacts] as any;

      //Return new state
      return {
        ...state,
        contacts: contactsData,
      };
    },
    removeContact: (state, action) => {
      //Find contact and delete from state
      let contactsData = [...state.contacts];

      //Delete contact
      const updatedContacts = contactsData.filter(
        (contact: IContact) => contact.contactRecipient !== action.payload
      );

      //Return new state
      return {
        ...state,
        contacts: updatedContacts,
      };
    },
    setContactMessages: (state, action) => {
      //Destructure payload.
      const { messages, username } = action.payload;
      //Set current state to variable[contactsData]
      let contactsData: any = [...state.contacts];
      //Find index of contact with username
      const contactIndex = contactsData.findIndex(
        (contact: IContact) => contact.contactRecipient === username
      );
      //Update contact in state with messages
      contactsData[contactIndex] = { ...contactsData[contactIndex], messages };
      //Return state
      return {
        ...state,
        contacts: contactsData,
      };
    },
    addContactMessage: (state, action) => {
      //Destructure payload
      const { username, message } = action.payload;

      //Assign current contact's state to variable[contactsData]
      let contactsData: any = [...state.contacts];

      //Find the index of contact sending message in state
      const contactIndex = contactsData.findIndex(
        (contact: IContact) => contact.contactRecipient === username
      );

      //Create new contact object with updated message and last message
      let updatedContact = {
        ...contactsData[contactIndex],
        messages: contactsData[contactIndex].messages
          ? [message, ...contactsData[contactIndex].messages]
          : null,
        lastMessage: message,
      };

      //Store upadted contact in state
      contactsData[contactIndex] = updatedContact;
      //Return new state
      return {
        ...state,
        contacts: contactsData,
      };
    },
  },
});

export const {
  setAllContacts,
  setContact,
  addContact,
  setSelectedContact,
  setContactMessages,
  addContactMessage,
  removeContact,
} = contact.actions;

export default contact.reducer;
