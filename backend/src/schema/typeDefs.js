import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Message {
    id: ID!
    content: String!
    user: User!
    createdAt: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    sendMessage(content: String!, username: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
  }
`;

export default typeDefs;
