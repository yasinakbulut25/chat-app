import { MESSAGE_ADDED, pubsub } from "./mutation";

const subscription = {
  messageAdded: {
    subscribe: () => pubsub.asyncIterableIterator([MESSAGE_ADDED]),
  },
};

export default subscription;
