import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Spin } from "antd";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "@redux/account/accountSlice";
import { getUserById } from "services/auth.user/user.auth.services";

const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("access_token");
      const user = JSON.parse(localStorage.getItem("user")) || {};

      if (token && user?._id) {
        try {
          const res = await getUserById(user._id);
          if (res.data) {
            dispatch(doGetAccountAction({ user: res.data }));
          } else {
            dispatch(doGetAccountAction({ user: {} }));
          }
        } catch (err) {
          console.error("Lỗi fetch user:", err);
          dispatch(doGetAccountAction({ user: {} }));
        }
      } else {
        dispatch(doGetAccountAction({ user: {} }));
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [dispatch]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
