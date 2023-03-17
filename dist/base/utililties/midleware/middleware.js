"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSignInUser = exports.auth = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//create a new instance of the subscription PubSub
const pubsub = new apollo_server_express_1.PubSub();
//Reason why you might not want to throw error here is because
//Some resolvers that does not require auth are connected in the context middleware
//Hence if you throw error or auth check. it will affect such resolvers.
//Examples of such in this case are Register and Login Resolvers
const auth = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    //Initialize token variable and set to empty string
    let token = "";
    //check if the context has the header[authorization]
    //and also connection for subscriptions
    if (ctx.req && ctx.req.headers.authorization) {
        token = (_a = ctx.req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1];
    }
    else if (ctx.connection && ctx.connection.context.Authorization) {
        token = (_b = ctx.connection.context.Authorization) === null || _b === void 0 ? void 0 : _b.split("Bearer ")[1];
    }
    //Verify token passed by user and decode it.
    if (token) {
        jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`, (err, decodedToken) => {
            //Set the authenticated user in user context
            if (err)
                console.log(err);
            ctx.user = decodedToken;
        });
    }
    //Set the pubsub as pubsub in the context
    ctx.pubsub = pubsub;
    //Return context
    return ctx;
});
exports.auth = auth;
//A function that returns user token
//ARGS - Any argument you would like to access in the authenticated user's object.
//This token expires in one day
const jwtSignInUser = (user) => {
    const ONE_DAY = 60 * 60 * 24;
    const { id, username, email, photoUrl } = user;
    const userData = { id, username, email, photoUrl };
    return jsonwebtoken_1.default.sign(userData, `${process.env.JWT_SECRET}`, {
        expiresIn: ONE_DAY,
    });
};
exports.jwtSignInUser = jwtSignInUser;
