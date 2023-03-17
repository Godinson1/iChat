"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const verifyUser = (user) => {
    if (!user)
        throw new apollo_server_express_1.AuthenticationError("You are not authorized to carry out this action!");
};
exports.verifyUser = verifyUser;
