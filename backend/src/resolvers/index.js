import { mutation } from "./mutation";
import query from "./query";
import subscription from "./subscription";

const resolvers = {
  Query: query,
  Mutaion: mutation,
  Subscription: subscription,
};

export default resolvers;
