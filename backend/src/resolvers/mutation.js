import { v4 as uuid } from "uuid";
import messages from "../data/messages.js";
import users from "../data/users.js";
import conversations from "../data/conversations.js";
import pubsub, {
  CONVERSATION_UPDATED,
  MESSAGE_ADDED,
  USER_ADDED,
} from "../pubsub.js";

export const mutation = {
  createConversation: (_, { participantIds }) => {
    const exists = conversations.find(
      (c) =>
        c.participantIds.length === participantIds.length &&
        c.participantIds.every((id) => participantIds.includes(id)),
    );

    if (exists) return exists;

    const conversation = {
      id: uuid(),
      participantIds,
      lastMessage: {
        content: "",
        createdAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    conversations.push(conversation);
    return conversation;
  },

  sendMessage: (_, { conversationId, senderId, content }) => {
    const conversation = conversations.find((c) => c.id === conversationId);

    if (!conversation) throw new Error("Conversation not found");

    if (!conversation.participantIds.includes(senderId)) {
      throw new Error("User is not part of this conversation");
    }

    const message = {
      id: uuid(),
      conversationId,
      content,
      senderId,
      createdAt: new Date().toISOString(),
    };

    messages.push(message);

    conversation.lastMessage = content;
    conversation.updatedAt = message.createdAt;

    pubsub.publish(MESSAGE_ADDED, {
      messageAdded: message,
    });

    pubsub.publish(CONVERSATION_UPDATED, {
      conversationUpdated: conversation,
    });

    return message;
  },

  createUser: (_, { input }) => {
    const exists = users.find((u) => u.id === input.id);
    if (exists) return exists;

    users.push(input);

    pubsub.publish(USER_ADDED, {
      userAdded: input,
    });

    return input;
  },
};
