import { gql } from "@apollo/client";

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($participantIds: [ID!]!) {
    createConversation(participantIds: $participantIds) {
      id
      participantIds
      lastMessage {
        content
        createdAt
      }
      updatedAt
    }
  }
`;
