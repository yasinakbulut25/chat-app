import messages from "../data/messages.js";
import users from "../data/users.js";

const query = {
  users: () => users,
  messages: (_, { conversationId }) => {
    return messages.filter((m) => m.conversationId === conversationId);
  },
  conversations: (_, { userId }) => {
    return conversations.filter((c) => c.participantIds.includes(userId));
  },
};

export default query;
