import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      from
      to
      content
      createdAt
      messageId
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      photoUrl
      createdAt
    }
  }
`;

export const GET_USER = gql`
  query getUser {
    getUser {
      username
      photoUrl
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      from
      to
      content
      messageId
    }
  }
`;

export const SEND_AUDIO_MESSAGE = gql`
  mutation sendAudioMessage($to: String!, $file: FileUpload!) {
    sendAudioMessage(to: $to, file: $file) {
      from
      to
      content
      messageId
    }
  }
`;

export const SEND_AUDIO_MESSAGES = gql`
  mutation sendAudioMessage($to: String!, $file: Upload!) {
    sendAudioMessage(to: $to, file: $file) {
      from
      to
      content
      messageId
    }
  }
`;

export const RECEIVE_MESSAGES = gql`
  subscription newMessage {
    newMessage {
      from
      messageId
      content
      createdAt
      to
    }
  }
`;
