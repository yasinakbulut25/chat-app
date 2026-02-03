import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

import typeDefs from "./schema/typeDefs.js";
import resolvers from "./resolvers/index.js";
import { onlineUsers } from "./data/onlineUsers.js";

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
    context: ({ req }) => {
      if (req) {
        const userId = req.headers["x-user-id"];
        return {
          user: userId ? { id: userId } : null,
        };
      }

      return { user: null };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // WebSocket Server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // GraphQL Subscriptions
  useServer(
    {
      schema,
      context: (ctx) => {
        const userId = ctx.connectionParams?.["x-user-id"];
        return {
          user: userId ? { id: userId } : null,
        };
      },

      onConnect: (ctx) => {
        const userId = ctx.connectionParams?.["x-user-id"];
        if (userId) {
          onlineUsers.add(userId);
          console.log("ONLINE:", userId);
        }
      },

      onDisconnect: (ctx) => {
        const userId = ctx.connectionParams?.["x-user-id"];
        if (userId) {
          onlineUsers.delete(userId);
          console.log("OFFLINE:", userId);
        }
      },
    },
    wsServer,
  );

  // Listen
  httpServer.listen(4000, () => {
    console.log("🚀 HTTP ready at http://localhost:4000/graphql");
    console.log("⚡ WS ready at ws://localhost:4000/graphql");
  });
}

startServer();
