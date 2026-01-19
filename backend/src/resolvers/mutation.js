import messages from "../data/messages.js";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const MESSAGE_ADDED = "MESSAGE_ADDED";

export const mutation = {
  sendMessage: (_, { content, username }) => {
    const message = {
      id: Date.now().toString(),
      content,
      user: {
        id: username,
        username,
      },
      createdAt: new Date().toISOString(),
    };

    messages.push(message);

    pubsub.publish(MESSAGE_ADDED, {
      messageAdded: message,
    });

    return message;
  },
};

export { pubsub, MESSAGE_ADDED };
