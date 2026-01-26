import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const wsClient = new ApolloClient({
  link: new GraphQLWsLink(
    createClient({
      url: "ws://localhost:4000/graphql",
    }),
  ),
  cache: new InMemoryCache(),
});
