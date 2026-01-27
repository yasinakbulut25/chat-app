import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export const MESSAGE_ADDED = "MESSAGE_ADDED";
export const USER_ADDED = "USER_ADDED";
export const CONVERSATION_UPDATED = "CONVERSATION_UPDATED";

export default pubsub;
