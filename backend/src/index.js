import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import typeDefs from "./schema/typeDefs.js";
import resolvers from "./resolvers/index.js";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // 1️⃣ Apollo Server (HTTP - Query & Mutation)
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // 2️⃣ WebSocket Server (Subscription)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // 3️⃣ GraphQL Subscriptions over WebSocket
  useServer(
    {
      schema: apolloServer.schema,
    },
    wsServer
  );

  // 4️⃣ Server listen
  httpServer.listen(4000, () => {
    console.log("🚀 HTTP ready at http://localhost:4000/graphql");
    console.log("⚡ WS ready at ws://localhost:4000/graphql");
  });
}

startServer();
