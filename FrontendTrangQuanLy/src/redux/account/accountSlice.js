import { createSlice } from "@reduxjs/toolkit";

const isUserAuthenticatedFromStorage =
  localStorage.getItem("isUserAuthenticated") === "true";
const userFromStorage = JSON.parse(localStorage.getItem("user")) || {};

const initialState = {
  isUserAuthenticated: isUserAuthenticatedFromStorage,
  isLoading: true,
  user: userFromStorage,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    doLoginAction: (state, action) => {
      const { user, token } = action.payload;
      state.isUserAuthenticated = true;
      state.isLoading = false;
      state.user = user;

      localStorage.setItem("isUserAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access_token", token);
    },
    doGetAccountAction: (state, action) => {
      state.isUserAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload.user;
    },
    doLogoutAction: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("isUserAuthenticated");

      state.isUserAuthenticated = false;
      state.isLoading = false;
      state.user = {
        _id: "",
        fullName: "",
        gender: "",
        email: "",
        address: "",
        phone: "",
        avatar: "",
        role: "",
      };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction } =
  accountSlice.actions;

export default accountSlice.reducer;
