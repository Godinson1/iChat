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

const production = process.env.NODE_ENV === "production";

const uploadLink = createUploadLink({
  uri: production ? "/graphql/" : "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("ichatToken");
  return { headers: {...headers, authorization: token ? `Bearer ${token}` : ""}};
});

const authTerminatingLink = [authLink, uploadLink];
const link = ApolloLink.from(authTerminatingLink);

const host = window.location.host;

const wsLink = new WebSocketLink({
  uri: production ? `ws://${host}/graphql/` : "ws://localhost:4000/graphql",
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
