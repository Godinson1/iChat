//Top level imports [dependencies]..
import React from "react";
import { Switch, Route } from "react-router-dom";
import JwtDecode from "jwt-decode";

//Import setups and configurations
import { ViewportProvider } from "./utils";
import { store, logoutUser } from "./redux";
import { ApolloProvider, AuthRoute } from "./setups";

//Import components
import { Login, Register, jwtType } from "./components";
import { CurrentChat, Chat } from "./components/Chat";

const App = () => {
  const token = localStorage.ichatToken;
  if (token) {
    const decoded = JwtDecode<jwtType>(token);
    if (decoded.exp * 1000 < Date.now()) {
      store.dispatch(logoutUser());
      window.location.href = "/login";
    }
  }

  return (
    <div className="App">
      <ViewportProvider>
        <ApolloProvider>
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <AuthRoute exact path="/" component={CurrentChat} />
            <AuthRoute exact path="/:id" component={Chat} />
          </Switch>
        </ApolloProvider>
      </ViewportProvider>
    </div>
  );
};

export default App;
