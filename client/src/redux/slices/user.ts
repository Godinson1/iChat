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
      //Set user data to state.
      state.users = action.payload;
      //Return state
      return state;
    },
    setUser: (state, action) => {
      //Set user data to state.
      state.user = action.payload;
      //Return state
      return state;
    },
    setSuccessMessage: (state, action) => {
      //Set success message.
      state.success = action.payload;
      //Return state
      return state;
    },
    setErrorMessage: (state, action) => {
      //Set error message.
      state.error = action.payload;
      //Return state
      return state;
    },
    clearData: (state) => {
      //clear error and success messages
      state.error = "";
      state.success = "";
      //Return state
      return state;
    },
  },
});

export const {
  setUser,
  setAllUsers,
  setContactModal,
  setPhotoModal,
  setPoolModal,
  setErrorMessage,
  setSuccessMessage,
  clearData,
} = user.actions;

export default user.reducer;
