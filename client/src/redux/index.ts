import {
  setAllUsers,
  setUser,
  setContactModal,
  setPhotoModal,
  setErrorMessage,
  setSuccessMessage,
  clearData,
  setPoolModal,
} from "./slices/user";
import store from "./store";

import {
  setIsLogin,
  setIsSignUp,
  setUserData,
  setIsLoggedOut,
} from "./slices/auth";

import {
  setAllContacts,
  addContact,
  setSelectedContact,
  setContactMessages,
  addContactMessage,
  removeContact,
} from "./slices/contact";

import { logoutUser, login, register } from "./actions/auth";

export {
  setIsLogin,
  setIsSignUp,
  setUserData,
  logoutUser,
  login,
  register,
  setIsLoggedOut,
  setAllUsers,
  setContactModal,
  setErrorMessage,
  setSuccessMessage,
  setPoolModal,
  setPhotoModal,
  setAllContacts,
  setSelectedContact,
  setContactMessages,
  addContactMessage,
  addContact,
  removeContact,
  setUser,
  clearData,
  store,
};
