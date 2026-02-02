import { withFilter } from "graphql-subscriptions";
import pubsub, {
  MESSAGE_ADDED,
  USER_ADDED,
  CONVERSATION_UPDATED,
} from "../pubsub.js";

const subscription = {
  messageAdded: {
    subscribe: withFilter(
      () => pubsub.asyncIterableIterator([MESSAGE_ADDED]),
      (payload, variables) =>
        payload.messageAdded.conversationId === variables.conversationId,
    ),
  },

  userAdded: {
    subscribe: () => pubsub.asyncIterableIterator([USER_ADDED]),
  },

  conversationUpdated: {
    subscribe: withFilter(
      () => pubsub.asyncIterableIterator([CONVERSATION_UPDATED]),
      (payload, variables) =>
        payload.conversationUpdated.participantIds.includes(variables.userId),
    ),
  },
};

export default subscription;
