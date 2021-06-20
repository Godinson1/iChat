import Login from "./Login";
import Register from "./Register";
import Landing from "./Landing";
import { LOGIN_FORM, REGISTER_FORM } from "./constants";
import { LOGIN_USER, REGISTER_USER } from "./schemas";
import { IErrors, jwtType } from "./interfaces";

export {
  Login,
  Register,
  Landing,
  LOGIN_FORM,
  LOGIN_USER,
  REGISTER_FORM,
  REGISTER_USER,
};
export type { IErrors, jwtType };
