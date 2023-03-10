import { setIsLoggedOut } from "../slices/auth";
import { setUser } from "../slices/user";
import { RouteComponentProps } from "react-router-dom";
import store from "../store";
import { authData } from "../interface";

export const register = (data: authData, history: RouteComponentProps["history"]) => async (dispatch: typeof store.dispatch) => {
  const { token, username } = data;
  await setAuthorization(token);
  dispatch(setUser({ username }));
  window.location.href = "/";
};

export const login = (data: authData, history: RouteComponentProps["history"]) => async (dispatch: typeof store.dispatch) => {
  const { token, username } = data;
  await setAuthorization(token);
  dispatch(setUser({ username }));
  window.location.href = "/";
};

export const logoutUser = () => async (dispatch: typeof store.dispatch) => {
  await localStorage.removeItem("ichatToken");
  dispatch(setIsLoggedOut({ status: false }));
  window.location.href = "/login";
};

export const setAuthorization = async (token: string) => {
  await localStorage.setItem("ichatToken", token);
};
