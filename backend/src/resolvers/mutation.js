import { v4 as uuid } from "uuid";
import messages from "../data/messages.js";
import users from "../data/users.js";
import conversations from "../data/conversations.js";
import pubsub, { MESSAGE_ADDED, USER_ADDED } from "../pubsub.js";

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
      lastMessage: null,
      updatedAt: new Date().toISOString(),
    };

    conversations.push(conversation);
    return conversation;
  },

  sendMessage: (_, { conversationId, senderId, content }) => {
    const message = {
      id: uuid(),
      conversationId,
      content,
      senderId,
      createdAt: new Date().toISOString(),
    };

    messages.push(message);

    const convo = conversations.find((c) => c.id === conversationId);
    if (convo) {
      convo.lastMessage = content;
      convo.updatedAt = message.createdAt;
    }

    pubsub.publish(MESSAGE_ADDED, {
      messageAdded: message,
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
