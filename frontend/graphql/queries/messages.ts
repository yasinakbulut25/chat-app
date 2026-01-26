import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!) {
    messages(conversationId: $conversationId) {
      id
      conversationId
      text
      senderId
    }
  }
`;
