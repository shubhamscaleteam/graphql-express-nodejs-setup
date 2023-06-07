import "dotenv/config";
import "./src/config/db.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./src/schema/typeDefs/index.js";
import resolvers from "./src/schema/resolvers/index.js";
import express from "express";
import http from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";

const port = process.env.PORT || 4000;
const app = express();
const httpServer = http.createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(express.json({ limit: "50mb" }));

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

// ***starting server...!!

await new Promise((resolve) => {
  httpServer.listen({ port: port }, resolve);
});

console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
