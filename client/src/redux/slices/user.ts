import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  user: {},
  error: "",
  success: "",
  openContactModal: false,
  openPoolModal: false,
  openPhotoModal: false,
};

const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setContactModal: (state, action) => {
      state.openContactModal = action.payload;
      return state;
    },
    setPoolModal: (state, action) => {
      state.openPoolModal = action.payload;
      return state;
    },
    setPhotoModal: (state, action) => {
      state.openPhotoModal = action.payload;
      return state;
    },
    setAllUsers: (state, action) => {
      state.users = action.payload;
      return state;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      return state;
    },
    setSuccessMessage: (state, action) => {
      state.success = action.payload;
      return state;
    },
    setErrorMessage: (state, action) => {
      state.error = action.payload;
      return state;
    },
    clearData: (state) => {
      state.error = "";
      state.success = "";
      return state;
    },
  },
});

export const { setUser, setAllUsers, setContactModal, setPhotoModal, setPoolModal, setErrorMessage, setSuccessMessage, clearData } =
  user.actions;

export default user.reducer;
