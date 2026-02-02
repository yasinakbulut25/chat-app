import { gql } from "@apollo/client";

export const GET_CONVERSATIONS = gql`
  query GetConversations($userId: ID!) {
    conversations(userId: $userId) {
      id
      participantIds
      lastMessage {
        id
        content
        senderId
        createdAt
      }
      updatedAt
    }
  }
`;
