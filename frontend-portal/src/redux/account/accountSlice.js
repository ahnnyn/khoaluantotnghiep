import { createSlice } from "@reduxjs/toolkit";
// Khởi tạo state từ localStorage
const initialState = {
  isUserAuthenticated: false,
  isLoading: true,
  user: {
    _id: "",
    fullName: "",
    gender: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
    role: "",
  },
  access_token: null,
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
        role: user.roleId?.roleName || user.role,
      };
      state.access_token = token;
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
        role:
          action.payload.roleId?.roleName ||
          action.payload.role ||
          state.user.role,
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
