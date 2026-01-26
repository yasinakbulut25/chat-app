import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage($conversationId: ID!, $text: String!) {
    sendMessage(conversationId: $conversationId, text: $text) {
      id
      conversationId
      text
      senderId
    }
  }
`;
