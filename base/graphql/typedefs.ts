import { gql } from "apollo-server-express";

// The GraphQL schema
const typedefs = gql`
  type User {
    username: String!
    email: String
    password: String
    token: String
    photoUrl: String
    createdAt: String!
  }

  type Message {
    from: String!
    to: String!
    messageId: String!
    content: String
    createdAt: String!
    reactions: [Reaction]
    type: String
  }

  type Reaction {
    content: String!
    reactionId: String!
    message: Message
    user: User
    createdAt: String!
  }

  type ResponseMessage {
    status: String!
    message: String!
    contactRecipient: String
  }

  scalar FileUpload

  type Contact {
    contactInitiator: String!
    contactRecipient: String!
    contactInitiatorPhotoUrl: String
    contactRecipientPhotoUrl: String
    lastMessage: Message
    createdAt: String!
  }

  type Query {
    getUsers: [User]!
    getUser: User!
    getUserContacts: [Contact]!
    loginUser(username: String!, password: String!): User!
    getMessages(from: String!): [Message]!
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!): User!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(messageId: String!, content: String!): Reaction!
    addContact(contactRecipient: String!): Contact!
    deleteContact(contactRecipient: String!): ResponseMessage!
    sendAudioMessage(to: String!, file: FileUpload!): Message!
    addProfilePhoto(file: FileUpload!): User!
  }

  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;

export default typedefs;
