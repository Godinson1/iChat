import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  split,
  ApolloLink,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

// Create File Upload Link
const uploadLink = createUploadLink({
  uri: "http://localhost:4000/graphql/",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("ichatToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const authTerminatingLink = [authLink, uploadLink];
const link = ApolloLink.from(authTerminatingLink);

const host = window.location.host;

const wsLink = new WebSocketLink({
  uri: `ws://${host}/graphql`,
  options: {
    reconnect: true,
    timeout: 20000,
    lazy: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem("ichatToken")}`,
    },
  },
});

window.addEventListener("beforeunload", () => {
  // @ts-ignore - the function is private in typescript
  wsLink.subscriptionClient.close();
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  link
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const ApolloProvider = (props: any) => <Provider client={client} {...props} />;

export default ApolloProvider;
