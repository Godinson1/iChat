"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_upload_1 = require("graphql-upload");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
//Import files
const models_1 = require("./models");
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const typedefs_1 = __importDefault(require("./graphql/typedefs"));
const utililties_1 = require("./utililties");
//Define middlewares
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(graphql_upload_1.graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));
//Create apollo server
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: typedefs_1.default,
    resolvers: resolvers_1.default,
    context: utililties_1.auth,
    uploads: false,
});
const httpServer = http_1.default.createServer(app);
server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);
const PORT = process.env.PORT || 4000;
models_1.db.sequelize
    .sync({ alter: true })
    .then(() => {
    httpServer.listen(PORT, () => {
        console.log("connected to database successfully..");
        console.log(`🚀 Server ready at ${PORT}${server.graphqlPath}`);
    });
})
    .catch((err) => console.log(err));
