import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $conversationId: ID!
    $senderId: ID!
    $content: String!
  ) {
    sendMessage(
      conversationId: $conversationId
      senderId: $senderId
      content: $content
    ) {
      id
      conversationId
      content
      senderId
      createdAt
    }
  }
`;
