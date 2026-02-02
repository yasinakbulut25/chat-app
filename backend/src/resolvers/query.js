import conversations from "../data/conversations.js";
import messages from "../data/messages.js";
import users from "../data/users.js";

const query = {
  users: () => users,
  messages: (_, { conversationId }, { user }) => {
    if (!user) throw new Error("Not authenticated");

    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) throw new Error("Conversation not found");

    if (!conversation.participantIds.includes(user.id)) {
      throw new Error("Access denied");
    }

    return messages.filter((m) => m.conversationId === conversationId);
  },
  conversations: (_, { userId }) =>
    conversations.filter((c) => c.participantIds.includes(userId)),
};

export default query;
