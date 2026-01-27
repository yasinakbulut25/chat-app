import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

import typeDefs from "./schema/typeDefs.js";
import resolvers from "./resolvers/index.js";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Apollo Server (HTTP)
  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // WebSocket Server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // GraphQL Subscriptions
  useServer({ schema }, wsServer);

  // Listen
  httpServer.listen(4000, () => {
    console.log("🚀 HTTP ready at http://localhost:4000/graphql");
    console.log("⚡ WS ready at ws://localhost:4000/graphql");
  });
}

startServer();
