import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
  token: null,
  email: "",
  isSignUp: false,
  isLogin: false,
};

const auth = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUserData: (state, action) => {
      const { data, token, email } = action.payload;
      state.data = data;
      state.token = token;
      state.email = email;
      return state;
    },
    setIsSignUp: (state, action) => {
      state.isSignUp = action.payload;
      return state;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload.status;
      state.token = action.payload.token;
      return state;
    },
    setIsLoggedOut: (state, action) => {
      state.isLogin = action.payload.status;
      state.token = null;
      return state;
    },
  },
});

export const { setUserData, setIsSignUp, setIsLogin, setIsLoggedOut } =
  auth.actions;

export default auth.reducer;
