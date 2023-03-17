import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import http from "http";
import cors from "cors";
import express from "express";

//Import files
import { db } from "./models";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typedefs";
import { auth as contextMiddleware } from "./utililties";

//Define middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

//Create apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  uploads: false,
});

const httpServer = http.createServer(app);
server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);

const PORT = process.env.PORT || 4000;

db.sequelize
  .sync({ alter: true })
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log("connected to database successfully..");
      console.log(`🚀 Server ready at ${PORT}${server.graphqlPath}`);
    });
  })
  .catch((err: any) => console.log(err));
