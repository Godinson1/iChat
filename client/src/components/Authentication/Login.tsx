import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { Button, Input } from "../../utils";
import { login } from "../../redux";
import { LOGIN_USER, IErrors } from "./index";
import "./auth.scss";

const Login = () => {
  const [errors, setErrors] = useState<IErrors | null>();
  const [error, setError] = useState<string>();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  };

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted: (data) => {
      //dispatch data to store locally
      dispatch(login(data.loginUser, history));
    },
    onError: (error) => {
      setError(error.message);
      setErrors(error.graphQLErrors[0]?.extensions?.errors);
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser({ variables: loginData });
  };

  useEffect(() => {
    if (error || errors) {
      setTimeout(() => {
        setError("");
        setErrors(null);
      }, 4000);
    }
  }, [error, errors]);

  return (
    <div className="landing">
      {error && <div className="auth-error-containter">{error}</div>}
      <h1>iChat</h1>
      <div className="auth-container">
        <div>
          <h2>Login</h2>
        </div>
        <div>
          <form onSubmit={handleLogin}>
            <Input
              error={(errors && errors?.username) ?? ""}
              value={loginData.username}
              name="username"
              onChange={handleChange}
              label="Username"
            />
            <Input
              error={(errors && errors?.password) ?? ""}
              value={loginData.password}
              name="password"
              type="password"
              onChange={handleChange}
              label="Password"
            />
            <Button
              label={loading ? "Loading..." : "Login"}
              disabled={loading}
            />
          </form>
          <Link id="link" to="/register">
            <div className="text-center">Not yet Registered? Sign Up</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
