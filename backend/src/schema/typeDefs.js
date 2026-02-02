import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    image: String!
    isOnline: Boolean!
  }

  input CreateUserInput {
    id: ID!
    name: String!
    image: String!
    isOnline: Boolean!
  }

  type Message {
    id: ID!
    conversationId: ID!
    content: String!
    senderId: ID!
    createdAt: String!
  }

  type Conversation {
    id: ID!
    participantIds: [ID!]!
    lastMessage: Message
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    messages(conversationId: ID!): [Message!]!
    conversations(userId: ID!): [Conversation!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createConversation(participantIds: [ID!]!): Conversation!
    sendMessage(conversationId: ID!, senderId: ID!, content: String!): Message!
  }

  type Subscription {
    userAdded: User!
    messageAdded(conversationId: ID!): Message!
    conversationUpdated(userId: ID!): Conversation!
  }
`;

export default typeDefs;
