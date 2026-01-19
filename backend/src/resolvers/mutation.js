import messages from "../data/messages";

const mutation = {
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

    return message;
  },
};

export default mutation;
