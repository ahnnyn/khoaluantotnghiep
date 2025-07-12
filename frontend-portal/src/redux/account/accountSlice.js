import { createSlice } from "@reduxjs/toolkit";

const isUserAuthenticatedFromStorage =
  localStorage.getItem("isUserAuthenticated") === "true";
const userFromStorage = JSON.parse(localStorage.getItem("user")) || {};

const initialState = {
  isUserAuthenticated: isUserAuthenticatedFromStorage,
  isLoading: false,
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
      state.user = {
        ...user,
        role: user.roleId?.roleName || user.role, // ép kiểu chuẩn
      };

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
      localStorage.removeItem("user");

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
    },

    doUpdateAccountAction: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
        role: action.payload.roleId?.roleName || action.payload.role || state.user.role,
      };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const {
  doLoginAction,
  doGetAccountAction,
  doLogoutAction,
  doUpdateAccountAction,
} = accountSlice.actions;

export default accountSlice.reducer;
