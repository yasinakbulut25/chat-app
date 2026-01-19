import { mutation } from "./mutation.js";
import query from "./query.js";
import subscription from "./subscription.js";

const resolvers = {
  Query: query,
  Mutation: mutation,
  Subscription: subscription,
};

export default resolvers;
