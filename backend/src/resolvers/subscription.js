import { withFilter } from "graphql-subscriptions";
import pubsub, { MESSAGE_ADDED, USER_ADDED } from "../pubsub.js";

const subscription = {
  messageAdded: {
    subscribe: withFilter(
      () => pubsub.asyncIterableIterator([MESSAGE_ADDED]),
      (payload, variables) => {
        return payload.messageAdded.conversationId === variables.conversationId;
      },
    ),
  },

  userAdded: {
    subscribe: () => pubsub.asyncIterableIterator([USER_ADDED]),
  },
};

export default subscription;
