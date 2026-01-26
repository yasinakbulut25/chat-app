import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageAdded($conversationId: String!) {
    messageAdded(conversationId: $conversationId) {
      id
      conversationId
      text
      senderId
    }
  }
`;
