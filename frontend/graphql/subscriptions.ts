import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageAdded($conversationId: ID!) {
    messageAdded(conversationId: $conversationId) {
      id
      conversationId
      content
      senderId
      createdAt
    }
  }
`;

export const USER_ADDED_SUBSCRIPTION = gql`
  subscription UserAdded {
    userAdded {
      id
      name
      image
      isOnline
    }
  }
`;

export const CONVERSATION_UPDATED_SUBSCRIPTION = gql`
  subscription OnConversationUpdated($userId: ID!) {
    conversationUpdated(userId: $userId) {
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
