import { MESSAGE_ADDED, pubsub } from "./mutation.js";

const subscription = {
  messageAdded: {
    subscribe: () => pubsub.asyncIterableIterator([MESSAGE_ADDED]),
  },
};

export default subscription;
