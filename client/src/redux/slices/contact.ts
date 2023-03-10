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
      state.contacts = action.payload;
      return state;
    },
    setContact: (state, action) => {
      state.contact = action.payload;
      return state;
    },
    setSelectedContact: (state, action) => {
      const contactsSelected = (state.contacts as unknown as any).map((contact: IContact) => ({
        ...contact,
        selected: contact.contactRecipient === action.payload,
      }));
      return { ...state, contacts: contactsSelected };
    },
    addContact: (state, action) => {
      let contactsData = [action.payload, ...state.contacts] as any;
      return { ...state, contacts: contactsData };
    },
    removeContact: (state, action) => {
      let contactsData = [...state.contacts];
      const updatedContacts = contactsData.filter((contact: IContact) => contact.contactRecipient !== action.payload);
      return { ...state, contacts: updatedContacts };
    },
    setContactMessages: (state, action) => {
      const { messages, username } = action.payload;
      let contactsData: any = [...state.contacts];
      const contactIndex = contactsData.findIndex((contact: IContact) => contact.contactRecipient === username);
      contactsData[contactIndex] = { ...contactsData[contactIndex], messages };
      return { ...state, contacts: contactsData };
    },
    addContactMessage: (state, action) => {
      const { username, message } = action.payload;
      let contactsData: any = [...state.contacts];
      const contactIndex = contactsData.findIndex((contact: IContact) => contact.contactRecipient === username);

      let updatedContact = {
        ...contactsData[contactIndex],
        messages: contactsData[contactIndex].messages ? [message, ...contactsData[contactIndex].messages] : null,
        lastMessage: message,
      };

      contactsData[contactIndex] = updatedContact;
      return { ...state, contacts: contactsData };
    },
  },
});

export const { setAllContacts, setContact, addContact, setSelectedContact, setContactMessages, addContactMessage, removeContact } =
  contact.actions;

export default contact.reducer;
