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
    const uniqueIds = [...new Set(participantIds)];

    if (uniqueIds.length < 2) {
      throw new Error("Conversation must have at least 2 participants");
    }

    const allUsersExist = uniqueIds.every((id) =>
      users.some((u) => u.id === id),
    );

    if (!allUsersExist) {
      throw new Error("One or more users not found");
    }

    const normalizedIds = [...uniqueIds].sort();

    const exists = conversations.find(
      (c) =>
        JSON.stringify([...c.participantIds].sort()) ===
        JSON.stringify(normalizedIds),
    );

    if (exists) return exists;

    const now = new Date().toISOString();

    const conversation = {
      id: uuid(),
      participantIds: normalizedIds,
      lastMessage: null,
      updatedAt: now,
    };

    conversations.push(conversation);
    return conversation;
  },

  sendMessage: (_, { conversationId, senderId, content }) => {
    if (!content.trim()) {
      throw new Error("Message content cannot be empty");
    }

    const senderExists = users.some((u) => u.id === senderId);
    if (!senderExists) {
      throw new Error("Sender not found");
    }

    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

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

    conversation.lastMessage = message;
    conversation.updatedAt = message.createdAt;

    pubsub.publish(MESSAGE_ADDED, { messageAdded: message });
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
