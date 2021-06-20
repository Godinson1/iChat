import { isEmpty, isEmail, isGreater } from "./helpers";
import { userData, loginData } from "./interface";

const validateReg = ({
  username,
  email,
  password,
}: userData): { errors: userData; valid: boolean } => {
  const errors = {} as userData;
  if (isEmpty(email)) errors.email = "Email must not be empty";
  else if (!isEmail(email)) errors.email = "Must be a valid email address";

  if (isEmpty(password)) errors.password = "Password must not be empty";
  if (isGreater(password))
    errors.password = "Password must have at least 6 characters";

  if (isEmpty(username)) errors.username = "Username must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const validateLogin = ({
  username,
  password,
}: loginData): { errors: loginData; valid: boolean } => {
  const errors = {} as loginData;

  if (isEmpty(password)) errors.password = "Password must not be empty";
  if (isGreater(password))
    errors.password = "Password must have at least 6 characters";

  if (isEmpty(username)) errors.username = "Username must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

export { validateLogin, validateReg };
