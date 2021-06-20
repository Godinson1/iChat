import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { Button, Input } from "../../utils";
import { register } from "../../redux";
import { REGISTER_USER, REGISTER_FORM, IErrors } from "./index";
import "./auth.scss";

const Register = () => {
  const [errors, setErrors] = useState<IErrors | null>();
  const [error, setError] = useState<string>();
  const [registerData, setLoginData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (error || errors) {
      setTimeout(() => {
        setError("");
        setErrors(null);
      }, 3000);
    }
  }, [error, errors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  };

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      //dispatch data to store locally
      dispatch(register(data.registerUser, history));
    },
    onError: (err) => {
      setError(err.message);
      setErrors(err.graphQLErrors[0]?.extensions?.errors);
    },
  });

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerUser({ variables: registerData });
  };

  return (
    <div className="landing">
      {error && <div className="auth-error-containter">{error}</div>}
      <h1>iChat</h1>
      <div className="auth-container">
        <div>
          <h2>Register</h2>
        </div>
        <div>
          <form onSubmit={handleRegister}>
            {REGISTER_FORM.map((data) => {
              const { type, label, name } = data;
              return (
                <div key={name}>
                  <Input
                    error={
                      errors &&
                      (name === "password"
                        ? errors?.password
                        : name === "email"
                        ? errors?.email
                        : name === "username"
                        ? errors?.username
                        : "")
                    }
                    type={type}
                    value={
                      name === "username"
                        ? registerData.username
                        : name === "email"
                        ? registerData.email
                        : registerData.password
                    }
                    name={name}
                    onChange={handleChange}
                    label={label}
                  />
                </div>
              );
            })}
            <Button
              label={loading ? "Loading..." : "Register"}
              disabled={loading}
            />
          </form>
          <Link id="link" to="/login">
            <div className="text-center">Already Registered? Sign In</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
