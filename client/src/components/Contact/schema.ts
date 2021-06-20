import { gql } from "@apollo/client";

export const GET_USER_CONTACTS = gql`
  query getUserContacts {
    getUserContacts {
      createdAt
      contactInitiator
      contactRecipient
      contactInitiatorPhotoUrl
      contactRecipientPhotoUrl
      lastMessage {
        content
        messageId
        from
        to
        createdAt
      }
    }
  }
`;

export const ADD_CONTACTS = gql`
  mutation addContact($contactRecipient: String!) {
    addContact(contactRecipient: $contactRecipient) {
      createdAt
      contactInitiator
      contactRecipient
      contactInitiatorPhotoUrl
      contactRecipientPhotoUrl
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation deleteContact($contactRecipient: String!) {
    deleteContact(contactRecipient: $contactRecipient) {
      status
      message
      contactRecipient
    }
  }
`;
